import React, { useState } from 'react'
import './styles/dropdown.css'

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
    <form className="dropdown-form" onSubmit={handleSubmit}>
      <select className="dropdown-select" value={selectedOption} onChange={handleChange}>
        <option className="dropdown-option" value="">Select an option</option>
        {options.map((option) => (
          <option 
            key={option} 
            value={option} 
            onClick={() => setSelectedOption(option)}
            className="dropdown-option"
          >
            {option}
          </option>
        ))}
      </select>
      <button type="submit" className="submit-button">Submit</button>
    </form>
  )
}

export default Dropdown
