import { globalContext } from '../contexts/globalContext';
import { useContext, useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';
import { Form, Input, Button } from 'antd';
import Slider from "react-slick";
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

export default function TestPage() {
    let { user, setUser } = useContext(globalContext);
    const [x, setX] = useState(null);
  const [y, setY] = useState(null);

  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    console.log('useEffect 1 - dependent on x:', x);
  }, [x]);

  useEffect(() => {
    console.log('useEffect 2 - dependent on y:', y);
  }, [y]);
let onClick, onClick1
    console.log('rerender');


    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
    };
    return (
        <div>
            {/* <Headbar /> */}
            <div className='mock long-mock'>
                TEST PAGE
                {/* <input value={state} onChange={(e) => { setState(e.target.value) }} /> */}
                <button onClick={onClick}>test</button>
                <button onClick={onClick1}>test1</button>
                {/* {state?.a?.map((element)=><p>{element}</p>)} */}
            </div>
<Form
      {...layout}
      form={form}
      name="basic"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
    <Slider {...settings} style={{width:'500px'}}>
      <div>
        <h3>1</h3>
      </div>
      <div>
        <h3>2</h3>
      </div>
      <div>
        <h3>3</h3>
      </div>
      <div>
        <h3>4</h3>
      </div>
      <div>
        <h3>5</h3>
      </div>
      <div>
        <h3>6</h3>
      </div>
    </Slider>

    <div style={{width:'20px'}}><p>this is a very long line</p></div><p></p>
        </div>
    )
}