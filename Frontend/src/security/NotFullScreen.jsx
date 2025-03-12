import React, { useContext, useEffect } from 'react'
import './NotFullScreen.css'
import { AuthContext } from '../context/AuthContext'
const NotFullScreen = ({checkFullScreen}) => {
  const {
    initializeCamera, checkInternetConnection, initializeMic
  } = useContext(AuthContext);
  useEffect(() => {
    initializeCamera();
    checkInternetConnection();
    initializeMic();
  }, [])
  
  return (
    <div className='fullscreen-overlay'>
        <h1>Please allow Full screen to conduct the test</h1>
        <button onClick={checkFullScreen} className="primary">Allow</button>
    </div>
  )
}

export default NotFullScreen