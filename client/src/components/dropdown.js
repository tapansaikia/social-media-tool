import React, { useState } from 'react'

const Dropdown = ({ options, onSubmit }) => {
  const [selectedOption, setSelectedOption] = useState('')

  const handleChange = (event) => {
    setSelectedOption(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(selectedOption)
  }

  return (
    <form onSubmit={handleSubmit}>
      <select value={selectedOption} onChange={handleChange}>
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <button type="submit">Submit</button>
    </form>
  )
}

export default Dropdown
