import {Container, Row, Col, Button,Input} from 'reactstrap';
import banner from '../assets/banner.jpg';
import { useState } from 'react';
import {useSelector,useDispatch} from 'react-redux';
import { savePost } from '../features/PostSlice';

const SharePost=()=>{
    let [msg,setMsg]=useState("");
    let [lat,setLat]=useState();
    let [lng,setLng]=useState();
    const email=useSelector((state)=>state.users.user.email);
    const dispatch=useDispatch();

    const sharePost=()=>{
        if(msg==""){
            alert("please enter the message to post...")
        }else{
            const data={
                postMsg:msg,
                email:"",
                lat:null,
                lng:null
            }
            dispatch(savePost(data));
        }

    }
    return(
        <Container >
            <Row>
                <img src={banner} className='bannerpic'/>
            </Row>
            <Row>
                <h3>Share.Connect</h3>
            </Row>
            <Row>
                <Col md='9'>
                <Input type="textarea" placeholder='Share your thoughts !...' onChange={(e)=>setMsg(e.target.value)}/>
                </Col>
                <Col>
                <Row><Button color='success' className='pushbutton' onClick={sharePost}>Post</Button></Row>
                <Row><Button color='danger'className='pushbutton'>SHARE LOCATION</Button></Row>
                </Col>
            </Row>
        </Container>
    );
}
export default SharePost;