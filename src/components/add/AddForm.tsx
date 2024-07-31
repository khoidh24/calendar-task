// AddForm.tsx

import { Form, Input, TimePicker, Button, Row, Col } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import React from 'react'
import useEventsStore from '../store/eventsStore'
import dayjs from 'dayjs'
import { FormValues, Event } from '../../types'

const AddForm: React.FC = () => {
  const [form] = Form.useForm()
  const { addEvent } = useEventsStore()

  const onFinish = (values: FormValues) => {
    console.log('Received values:', values)
    values.events.forEach((event: Event) => {
      addEvent({
        title: event.title,
        content: event.content,
        eventStartTime: dayjs(event.eventStartTime),
        eventEndTime: dayjs(event.eventEndTime)
      })
    })
    form.resetFields()
  }

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 24 }}
      style={{ maxWidth: 600 }}
      layout='horizontal'
      onFinish={onFinish}
      initialValues={{ events: [{}] }} // Ensuring at least one event is shown initially
    >
      <Form.List name='events'>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div
                key={key}
                style={{
                  marginBottom: 8
                }}
              >
                <Form.Item
                  {...restField}
                  name={[name, 'title']}
                  label='Title'
                  rules={[{ required: true, message: 'Title is mandatory.' }]}
                  style={{ width: '100%' }}
                >
                  <Input placeholder='Title...' />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'content']}
                  label='Content'
                  style={{ width: '100%' }}
                >
                  <Input placeholder='Text a note...' />
                </Form.Item>
                <Form.Item label='Time' required>
                  <Row gutter={8}>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'eventStartTime']}
                        rules={[
                          { required: true, message: 'Start Time is required' }
                        ]}
                        style={{ marginBottom: 0 }}
                      >
                        <TimePicker
                          use12Hours
                          format='HH:mm A'
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
                        style={{ marginBottom: 0 }}
                      >
                        <TimePicker
                          use12Hours
                          format='HH:mm A'
                          minuteStep={10}
                          placeholder='End Time'
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
                {fields.length > 1 ? (
                  <MinusCircleOutlined onClick={() => remove(name)} />
                ) : null}
              </div>
            ))}
            <Form.Item>
              <Button
                type='dashed'
                onClick={() => add()}
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
        <Button
          type='primary'
          htmlType='submit'
          icon={<PlusOutlined />}
          style={{ width: '100%' }}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AddForm
