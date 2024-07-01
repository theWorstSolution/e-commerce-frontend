import { globalContext } from '../contexts/globalContext';
import { useContext, useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';
import { Form, Input, Button } from 'antd';
import Slider from "react-slick";
import LoadingPage from './LoadingPage';
import NotFoundPage from './NotFoundPage';

export default function TestPage() {
    
    return (
        <NotFoundPage/>
    )
}