import React, { useState } from 'react'

const Form = ({ onSubmit }) => {
  const [postText, setPostText] = useState('')

  const handleChange = (event) => {
    setPostText(event.target.value)
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('your_backend_api_endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: postText }),
      })
      if (response.ok) {
        console.log('Post submitted successfully')
        onSubmit();
        setPostText('');
      } else {
        console.error('Failed to submit post')
      }
    } catch (error) {
      console.error('Error submitting post:', error)
    }
  }

  return (
    <div>
      <textarea
        value={postText}
        onChange={handleChange}
        placeholder="Write your post..."
        rows={4}
        cols={50}
      />
      <br />
      <button onClick={handleSubmit}>Submit Post</button>
    </div>
  );
}

export default Form
