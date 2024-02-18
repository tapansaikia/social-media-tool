import React from 'react'
import Form from './form'
import List from './list'
import Dropdown from './dropdown'

const Home = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const isLoggedIn = urlParams.get('logged')

  const handleDropdownSubmit = async (option) => {
    try {
      window.location.href = `http://localhost:3001/api/v1/${option}/login`;
    } catch (error) {
      console.error('Error redirecting:', error);
    }
  }
  

  return true ? (
    <>
      <Form />
      <List />
    </>
  ) : (
    <Dropdown 
      onSubmit={handleDropdownSubmit} 
      options={['x', 'instagram', 'twitter']}
    />
  )
}

export default Home