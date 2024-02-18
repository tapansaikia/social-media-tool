import React, { useState } from 'react'
import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'
import './styles/form.css'

const Form = ({ onSubmit }) => {
  const [postText, setPostText] = useState('')
  const [timeOfPost, setTimeOfPost] = useState()

  const handleChange = (event) => {
    setPostText(event.target.value)
  }

  const handleTimeChange = (value) => {
    if (value && value._isValid) { 
      const timestamp = new Date(value).getTime()
      setTimeOfPost(timestamp)
    }
  }

  const handleSubmit = async () => {
    try {      
      const response = await fetch('http://localhost:3001/api/v1/add-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postBody: postText, post_timestamp: timeOfPost, postTo: 'x' }),
      })
      
      if (response.ok) {
        console.log('Post submitted successfully')
        onSubmit()
        setPostText('')
        setTimeOfPost()
      } else {
        console.error('Failed to submit post')
      }
    } catch (error) {
      console.error('Error submitting post:', error)
    }
  }

  return (
    <div className="form-container">
      <div className="form-header">{`Share your thoughts & optionally select date time for creating a post on X (formerly Twitter)`}</div>
      <textarea
        value={postText}
        onChange={handleChange}
        placeholder="Write your post..."
        rows={4}
        cols={50}
        className="post-textarea"
      />
      <br />
      <Datetime
        value={timeOfPost}
        onChange={handleTimeChange}
        inputProps={{ placeholder: 'Select post time' }}
        className="datetime-input"
      />
      <br />
      <button disabled={!postText.length} onClick={handleSubmit} className="submit-button">Submit Post</button>
    </div>
  )
}

export default Form
