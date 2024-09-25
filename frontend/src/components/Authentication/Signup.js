import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import imageTobase64 from '../../helpers/imageToBase64'


const Signup = () => {

  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  // const navigate = useNavigate();

  const handleClick1 = () => setShow1(!show1);
  const handleClick2 = () => setShow2(!show2);


  const handleUploadPic = async (e) => {
    const file = e.target.files[0]

    console.log('file', file);


    const imagePic = await imageTobase64(file);

    setPic(imagePic);

  }

  const submitHandler = async () => {
    // setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      // setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(name, email, password, pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      
      // setPicLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      // setPicLoading(false);
    }
  };

  return (
    <VStack spacing='5px' bg={'white'} color={'black'}>
      <FormControl idisplay="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input placeholder='Enter Your Name' onChange={(e) => setName(e.target.value)} />
      </FormControl>

      <FormControl idisplay="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input type={'email'} placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} />
      </FormControl>

      <FormControl idisplay="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input type={show1 ? "text" : 'password'} placeholder='Enter Your Password' onChange={(e) => setPassword(e.target.value)} />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick1}>
              {show1 ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl idisplay="confirmpassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input type={show2 ? "text" : 'password'} placeholder='Confirm Your Password' onChange={(e) => setConfirmpassword(e.target.value)} />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick2}>
              {show2 ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl idisplay="pic" isRequired>
        <FormLabel>Upload Your Picture</FormLabel>
        {/* <Input type={'file'} p={1.5} accept="image/*" onChange={(e) => postDetails(e.target.files[0])} /> */}
        <Input type={'file'} p={1.5} accept="image/*" onChange={handleUploadPic}/>
      </FormControl>

      <Button colorScheme='blue' width="100%" style={{ marginTop: 15 }} onClick={submitHandler} isLoading={loading}>
        Sign Up
      </Button>

    </VStack>
  )
}

export default Signup
