import React from "react";
import styles from './styles.module.css'
import { useState } from "react";
import { useNavigate } from 'react-router-dom'

const Login = ({socket}) => {
    const [access, setAccess] = useState()
    
    const navigate = useNavigate()
    const[name, setName] = useState('');
    const[password, setPassword] = useState('')
    
    const handleSubmit = (e) => {
        e.preventDefault()
        socket.emit('user', { name, password })
        socket.on('answer', (data) => {
            if(data.userName === true && data.correctPassword === true ){
                localStorage.setItem('id', data.id);
                localStorage.setItem('firstName', data.firstName);
                localStorage.setItem('middleName', data.middleName);
                localStorage.setItem('lastName', data.lastName)
                navigate('/tasklist')
            } else if (!data.userName) {
                setAccess(<p className={styles.alert}>Неправильное имя пользователя</p>);
            } else {
                setAccess(<p className={styles.alert}>Неправильный пароль</p>);
            }
        })
        setName('');
        setPassword('');
    }
    return (
        <div className={styles.login}>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <h3>Авторизация</h3>
                <p><label htmlFor='user'>Имя пользователя</label></p>
                <input 
                    type='text' 
                    id='user'
                    value={ name }
                    onChange={ (e) => setName( e.target.value ) }/><br></br>
                <p><label htmlFor='password'>Пароль</label></p>
                <input 
                    type='password' 
                    id='password'
                    value={ password }
                    onChange={ (e) => setPassword( e.target.value ) }/><br></br>
                <button type='submit' className={styles.btn}>Войти</button>
                {access}
            </form>
        </div>
    )
}

export default Login