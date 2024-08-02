import { Form, Input, TimePicker, Button, Row, Col, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import React, { useEffect, useState, useMemo } from 'react'
import useEventsStore from '../../store/eventsStore'
import dayjs from 'dayjs'
import { FormValues, Event } from '../../types'
import locationData from '../../data/cities.json'
import { LocationData, AddFormProps } from '../../types'
import sortOptions from '../../utils/sortOptions'
import { v4 as uuidv4 } from 'uuid'

const { TextArea } = Input

const typedLocationData: LocationData = locationData

const AddForm: React.FC<AddFormProps> = ({ setIsModalVisible }) => {
	const [form] = Form.useForm()
	const addEvent = useEventsStore((state) => state.addEvent)
	const [provinces, setProvinces] = useState<{ value: string; label: string }[]>(
		[]
	)
	const [eventTitles, setEventTitles] = useState<string[]>(['Event 1'])

	const handleTitleBlur = (
		index: number,
		e: React.FocusEvent<HTMLInputElement>
	) => {
		const newTitle = e.target.value.trim() || `Event ${index + 1}`
		setEventTitles((prev) => {
			const newTitles = [...prev]
			newTitles[index] = newTitle
			return newTitles
		})
	}

	useEffect(() => {
		const provinceOptions = Object.entries(typedLocationData).map(
			([code, data]) => ({
				value: code,
				label: data.name_with_type,
			})
		)
		setProvinces(sortOptions(provinceOptions))
	}, [])

	const provincesWithEmpty = useMemo(() => {
		return [{ value: '', label: '-- Select Province/City --' }, ...provinces]
	}, [provinces])

	const getDistrictsWithEmpty = (provinceCode: string) => {
		if (!provinceCode) return [{ value: '', label: 'Select District' }]
		const districtOptions = Object.entries(
			typedLocationData[provinceCode]['quan-huyen']
		).map(([code, data]) => ({
			value: code,
			label: data.name_with_type,
		}))
		return [
			{ value: '', label: 'Select District' },
			...sortOptions(districtOptions),
		]
	}

	const getWardsWithEmpty = (provinceCode: string, districtCode: string) => {
		if (!provinceCode || !districtCode)
			return [{ value: '', label: 'Select Ward' }]
		const wardOptions = Object.entries(
			typedLocationData[provinceCode]['quan-huyen'][districtCode]['xa-phuong']
		).map(([code, data]) => ({
			value: code,
			label: data.name_with_type,
		}))
		return [{ value: '', label: 'Select Ward' }, ...sortOptions(wardOptions)]
	}

	const onFinish = (values: FormValues) => {
		console.log('Received values:', values)
		values.events.forEach((event: Event) => {
			const newEvent: Event = {
				id: uuidv4(),
				title: event.title,
				content: event.content,
				eventStartTime: dayjs(event.eventStartTime),
				eventEndTime: dayjs(event.eventEndTime),
				address: event.address,
				province: event.province,
				district: event.district,
				ward: event.ward,
			}

			addEvent(newEvent)
		})
		setIsModalVisible(false)
		setEventTitles(['Event 1'])
		form.resetFields()
	}

	return (
		<Form
			form={form}
			labelCol={{ span: 4 }}
			wrapperCol={{ span: 24 }}
			style={{ maxWidth: 700 }}
			layout='vertical'
			onFinish={onFinish}
			initialValues={{ events: [{}] }}
		>
			<Form.List name='events'>
				{(fields, { add, remove }) => (
					<>
						{fields.map(({ key, name, ...restField }, index) => (
							<div
								key={key}
								style={{
									marginBottom: 16,
									border: '1px solid #f0f0f0',
									borderRadius: 8,
									padding: 16,
									textAlign: 'center',
								}}
							>
								<h3 style={{ fontWeight: 800 }}>
									{eventTitles[index] || `Event ${index + 1}`}
								</h3>
								<Form.Item
									{...restField}
									name={[name, 'title']}
									label='Title'
									rules={[{ required: true, message: 'Title is mandatory' }]}
								>
									<Input
										placeholder='Title...'
										onBlur={(e) => handleTitleBlur(index, e)}
									/>
								</Form.Item>
								<Form.Item {...restField} name={[name, 'content']} label='Content'>
									<TextArea
										placeholder='Text a note...'
										autoSize={{ minRows: 2, maxRows: 6 }}
									/>
								</Form.Item>
								<Form.Item label='Time'>
									<Row gutter={8}>
										<Col span={12}>
											<Form.Item {...restField} name={[name, 'eventStartTime']}>
												<TimePicker
													use12Hours
													format='hh:mm A'
													minuteStep={10}
													placeholder='Start Time'
													style={{ width: '100%' }}
												/>
											</Form.Item>
										</Col>
										<Col span={12}>
											<Form.Item
												{...restField}
												name={[name, 'eventEndTime']}
												rules={[
													{
														validator: async (_, value) => {
															if (
																value &&
																form.getFieldValue(['events', name, 'eventStartTime']) &&
																dayjs(value).isBefore(
																	dayjs(form.getFieldValue(['events', name, 'eventStartTime']))
																)
															) {
																return Promise.reject('End time must be after start time')
															}
															return Promise.resolve()
														},
													},
												]}
											>
												<TimePicker
													use12Hours
													format='hh:mm A'
													minuteStep={10}
													placeholder='End Time'
													style={{ width: '100%' }}
												/>
											</Form.Item>
										</Col>
									</Row>
								</Form.Item>
								<Form.Item>
									<Row gutter={8}>
										<Col span={12}>
											<Form.Item {...restField} name={[name, 'address']} label='Address'>
												<Input placeholder='Address...' />
											</Form.Item>
										</Col>
										<Col span={12}>
											<Form.Item
												label='Province/City'
												{...restField}
												style={{ textAlign: 'left' }}
												name={[name, 'province']}
											>
												<Select
													placeholder='Province/city...'
													options={provincesWithEmpty}
													showSearch
													filterOption={(input, option) =>
														(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
													}
												/>
											</Form.Item>
										</Col>
									</Row>
								</Form.Item>
								<Form.Item style={{ textAlign: 'left' }}>
									<Row gutter={8}>
										<Col span={12}>
											<Form.Item
												noStyle
												shouldUpdate={(prevValues, curValues) =>
													prevValues.events[name]?.province !==
													curValues.events[name]?.province
												}
											>
												{() => (
													<Form.Item
														label='District'
														{...restField}
														name={[name, 'district']}
														dependencies={[[name, 'province']]}
													>
														<Select
															placeholder='District...'
															disabled={!form.getFieldValue(['events', name, 'province'])}
															options={getDistrictsWithEmpty(
																form.getFieldValue(['events', name, 'province'])
															)}
															showSearch
															filterOption={(input, option) =>
																(option?.label ?? '')
																	.toLowerCase()
																	.includes(input.toLowerCase())
															}
														/>
													</Form.Item>
												)}
											</Form.Item>
										</Col>
										<Col span={12}>
											<Form.Item
												noStyle
												shouldUpdate={(prevValues, curValues) =>
													prevValues.events[name]?.province !==
														curValues.events[name]?.province ||
													prevValues.events[name]?.district !==
														curValues.events[name]?.district
												}
											>
												{() => (
													<Form.Item
														label='Ward'
														{...restField}
														name={[name, 'ward']}
														dependencies={[
															[name, 'province'],
															[name, 'district'],
														]}
													>
														<Select
															placeholder='Ward...'
															disabled={!form.getFieldValue(['events', name, 'district'])}
															options={getWardsWithEmpty(
																form.getFieldValue(['events', name, 'province']),
																form.getFieldValue(['events', name, 'district'])
															)}
															showSearch
															filterOption={(input, option) =>
																(option?.label ?? '')
																	.toLowerCase()
																	.includes(input.toLowerCase())
															}
														/>
													</Form.Item>
												)}
											</Form.Item>
										</Col>
									</Row>
								</Form.Item>
								{fields.length > 1 ? (
									<Button
										type='dashed'
										onClick={() => remove(name)}
										style={{ width: '100%' }}
										danger
									>
										Remove event
									</Button>
								) : null}
							</div>
						))}
						<Form.Item>
							<Button
								type='dashed'
								onClick={() => {
									add()
									setEventTitles((prev) => [...prev, `Event ${prev.length + 1}`])
								}}
								icon={<PlusOutlined />}
								style={{ width: '100%' }}
							>
								Add Event
							</Button>
						</Form.Item>
					</>
				)}
			</Form.List>
			<Form.Item>
				<Button type='primary' htmlType='submit' style={{ width: '100%' }}>
					Submit
				</Button>
			</Form.Item>
		</Form>
	)
}

export default AddForm
