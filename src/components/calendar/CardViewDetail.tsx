import React, { useMemo, useEffect } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import {
	Badge,
	Card,
	Form,
	Input,
	TimePicker,
	Button,
	Select,
	Row,
	Col,
} from 'antd'
import { CardViewDetailProps, LocationData, updateFormProps } from '../../types'
import dayjs from 'dayjs'
import useEventsStore from '../../store/eventsStore'
import locationData from '../../data/cities.json'
import sortOptions from '../../utils/sortOptions'

const CardViewDetail: React.FC<CardViewDetailProps> = ({
	event,
	onClose,
	isEditing,
	setIsEditing,
}) => {
	const deleteEvent = useEventsStore((state) => state.removeEvent)
	const updateEvent = useEventsStore((state) => state.updateEvent)
	const [form] = Form.useForm()

	const typedLocationData = locationData as LocationData

	const locationNames = useMemo(() => {
		const province =
			event.province && typedLocationData[event.province]?.name_with_type
		const district =
			event.province &&
			event.district &&
			typedLocationData[event.province]?.['quan-huyen']?.[event.district]
				?.name_with_type
		const ward =
			event.province &&
			event.district &&
			event.ward &&
			typedLocationData[event.province]?.['quan-huyen']?.[event.district]?.[
				'xa-phuong'
			]?.[event.ward]?.name_with_type

		return { province, district, ward }
	}, [event.province, event.district, event.ward, typedLocationData])

	const provinces = useMemo(() => {
		const options = Object.entries(typedLocationData).map(([code, data]) => ({
			value: code,
			label: data.name_with_type,
		}))
		return [
			{ value: '', label: '-- Select Province/City --' },
			...sortOptions(options),
		]
	}, [typedLocationData])

	const getDistricts = (provinceCode: string) => {
		const options = Object.entries(
			typedLocationData[provinceCode]?.['quan-huyen'] || {}
		).map(([code, data]) => ({
			value: code,
			label: data.name_with_type,
		}))
		return [
			{ value: '', label: '-- Select District --' },
			...sortOptions(options),
		]
	}

	const getWards = (provinceCode: string, districtCode: string) => {
		const options = Object.entries(
			typedLocationData[provinceCode]?.['quan-huyen']?.[districtCode]?.[
				'xa-phuong'
			] || {}
		).map(([code, data]) => ({
			value: code,
			label: data.name_with_type,
		}))
		return [{ value: '', label: '-- Select Ward --' }, ...sortOptions(options)]
	}

	const handleDelete = () => {
		deleteEvent(event.id)
		onClose()
	}

	const handleEdit = () => {
		setIsEditing(true)
	}

	const handleUpdate = (values: updateFormProps) => {
		updateEvent({
			...event,
			...values,
			eventStartTime: values.eventStartTime || undefined,
			eventEndTime: values.eventEndTime || undefined,
		})
		setIsEditing(false)
		onClose()
	}

	const handleCancelEdit = () => {
		setIsEditing(false)
	}

	useEffect(() => {
		form.resetFields()
		form.setFieldsValue({
			title: event.title || '',
			content: event.content || '',
			eventStartTime: dayjs(event.eventStartTime) || undefined,
			eventEndTime: dayjs(event.eventEndTime) || undefined,
			address: event.address || undefined,
			province: event.province || undefined,
			district: event.district || undefined,
			ward: event.ward || undefined,
		})
	}, [event, form, isEditing])

	return (
		<>
			{isEditing ? (
				<Form
					style={{ zIndex: 1000 }}
					form={form}
					layout='vertical'
					onFinish={handleUpdate}
					initialValues={{
						title: event.title || '',
						content: event.content || '',
						eventStartTime: event.eventStartTime
							? dayjs(event.eventStartTime.format('hh:mm A'))
							: null,
						eventEndTime: event.eventEndTime
							? dayjs(event.eventEndTime.format('hh:mm A'))
							: null,
						address: event.address || undefined,
						province: event.province || undefined,
						district: event.district || undefined,
						ward: event.ward || undefined,
					}}
				>
					<Form.Item name='title' label='Title'>
						<Input />
					</Form.Item>
					<Form.Item name='content' label='Content'>
						<Input />
					</Form.Item>
					<Form.Item label='Time'>
						<Form.Item
							name='eventStartTime'
							style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
						>
							<TimePicker
								use12Hours
								format='hh:mm A'
								minuteStep={10}
								placeholder='Start Time'
								style={{ width: '100%' }}
							/>
						</Form.Item>
						<Form.Item
							name='eventEndTime'
							style={{
								display: 'inline-block',
								width: 'calc(50% - 8px)',
								marginLeft: 8,
							}}
							rules={[
								{
									validator: (_, value) => {
										if (
											!value ||
											dayjs(value).isBefore(form.getFieldValue('eventStartTime'))
										) {
											return Promise.reject(new Error('End time must be after start time'))
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
					</Form.Item>
					<Form.Item>
						<Row gutter={8}>
							<Col span={12}>
								<Form.Item name='address' label='Address'>
									<Input placeholder='Address...' />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item name='province' label='Province'>
									<Select
										options={provinces}
										onChange={() => {
											form.setFieldsValue({ district: undefined, ward: undefined })
										}}
									/>
								</Form.Item>
							</Col>
						</Row>
					</Form.Item>

					<Form.Item>
						<Row gutter={8}>
							<Col span={12}>
								<Form.Item
									noStyle
									shouldUpdate={(prevValues, currentValues) =>
										prevValues.province !== currentValues.province
									}
								>
									{({ getFieldValue }) => (
										<Form.Item name='district' label='District'>
											<Select
												options={getDistricts(getFieldValue('province'))}
												onChange={() => {
													form.setFieldsValue({ ward: undefined })
												}}
												disabled={!getFieldValue('province')}
											/>
										</Form.Item>
									)}
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									noStyle
									shouldUpdate={(prevValues, currentValues) =>
										prevValues.province !== currentValues.province ||
										prevValues.district !== currentValues.district
									}
								>
									{({ getFieldValue }) => (
										<Form.Item name='ward' label='Ward'>
											<Select
												options={getWards(
													getFieldValue('province'),
													getFieldValue('district')
												)}
												disabled={!getFieldValue('district')}
											/>
										</Form.Item>
									)}
								</Form.Item>
							</Col>
						</Row>
					</Form.Item>
					<Form.Item>
						<Button type='primary' htmlType='submit' style={{ marginRight: 8 }}>
							Update
						</Button>
						<Button onClick={handleCancelEdit}>Cancel</Button>
					</Form.Item>
				</Form>
			) : (
				<Badge.Ribbon text='TEST' color='green'>
					<Card
						actions={[
							<EditOutlined key='edit' onClick={handleEdit} />,
							<DeleteOutlined key='delete' onClick={handleDelete} />,
						]}
					>
						<h1>{event.title}</h1>
						<p>{event.content}</p>
						<p>
							{event.eventStartTime
								? dayjs(event.eventStartTime).format('h:mm A')
								: null}
							{event.eventEndTime &&
								' - ' + dayjs(event.eventEndTime).format('h:mm A')}
						</p>
						{(event.province || event.district || event.ward) && (
							<>
								{' '}
								<h4>At:</h4>
								<strong>{locationNames.province}</strong>
								<p>{event.address}</p>
								<p>
									{locationNames.district && `${locationNames.district}, `}
									{locationNames.ward && `${locationNames.ward}`}
								</p>
							</>
						)}
					</Card>
				</Badge.Ribbon>
			)}
		</>
	)
}

export default CardViewDetail
