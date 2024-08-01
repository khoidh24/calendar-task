import React, { useMemo } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Badge, Card, Form, Input, TimePicker, Button, Select } from 'antd'
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
			typedLocationData[event.province]?.name_with_type || event.province
		const district =
			typedLocationData[event.province]?.['quan-huyen']?.[event.district]
				?.name_with_type || event.district
		const ward =
			typedLocationData[event.province]?.['quan-huyen']?.[event.district]?.[
				'xa-phuong'
			]?.[event.ward]?.name_with_type || event.ward

		return { province, district, ward }
	}, [event.province, event.district, event.ward, typedLocationData])

	const provinces = useMemo(() => {
		const options = Object.entries(typedLocationData).map(([code, data]) => ({
			value: code,
			label: data.name_with_type,
		}))
		return sortOptions(options)
	}, [typedLocationData])

	const getDistricts = (provinceCode: string) => {
		const options = Object.entries(
			typedLocationData[provinceCode]?.['quan-huyen'] || {}
		).map(([code, data]) => ({
			value: code,
			label: data.name_with_type,
		}))
		return sortOptions(options)
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
		return sortOptions(options)
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
			eventStartTime: values.eventStartTime
				? dayjs(values.eventStartTime)
				: undefined,
			eventEndTime: values.eventEndTime
				? dayjs(values.eventEndTime)
				: undefined,
		})
		setIsEditing(false)
		onClose()
	}

	const handleCancelEdit = () => {
		setIsEditing(false)
	}

	return (
		<>
			{isEditing ? (
				<Form
					form={form}
					layout='vertical'
					onFinish={handleUpdate}
					initialValues={{
						title: event.title || '',
						content: event.content || '',
						eventStartTime: event.eventStartTime
							? dayjs(event.eventStartTime)
							: null,
						eventEndTime: event.eventEndTime ? dayjs(event.eventEndTime) : null,
						address: event.address || '',
						province: event.province || undefined,
						district: event.district || undefined,
						ward: event.ward || undefined,
					}}
				>
					<Form.Item
						name='title'
						label='Title'
						rules={[{ required: true, message: 'Title is mandatory.' }]}
					>
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
								format='HH:mm A'
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
						>
							<TimePicker
								use12Hours
								format='HH:mm A'
								minuteStep={10}
								placeholder='End Time'
								style={{ width: '100%' }}
							/>
						</Form.Item>
					</Form.Item>
					<Form.Item name='address' label='Address'>
						<Input />
					</Form.Item>
					<Form.Item name='province' label='Province'>
						<Select
							options={provinces}
							onChange={() => {
								form.setFieldsValue({ district: undefined, ward: undefined })
							}}
						/>
					</Form.Item>
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
								? dayjs(event.eventStartTime).format('HH:mm A')
								: null}
							{event.eventEndTime &&
								' - ' + dayjs(event.eventEndTime).format('HH:mm A')}
						</p>
						<h4>At:</h4>
						<strong>{locationNames.province}</strong>
						<p>{event.address}</p>
						<p>
							{locationNames.district && `${locationNames.district}, `}
							{locationNames.ward && `${locationNames.ward}`}
						</p>
					</Card>
				</Badge.Ribbon>
			)}
		</>
	)
}

export default CardViewDetail
