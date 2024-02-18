import React, { useState } from 'react'
import './styles/list.css' // Import the CSS file

const List = () => {
  const [posts, setPosts] = useState([])

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/get-posts') // replace with your callback URL
      if (response.ok) {
        console.log('Posts fetched successfully', response)
        const postsData = await response.json()
        setPosts(postsData)
      } else {
        console.error('Failed to fetch posts')
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const getDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <div className="list-container">
      <button onClick={fetchPosts} className="fetch-button">Fetch Posts</button>
      {posts.length ? <div className="posts-table">
        <h2>All Posts</h2>
        <table>
          <thead>
            <tr>
              <th className="table-header">Post ID</th>
              <th className="table-header">Post Body</th>
              <th className="table-header">Scheduled For</th>
              <th className="table-header">Posted At</th>
              <th className="table-header">Posted On Platform</th>
            </tr>
          </thead>
          <tbody>
              {posts.map((post, index) => (
                <tr key={index}>
                  <td>{post.postId}</td>
                  <td>{post.postBody}</td>
                  <td>{getDate(post.post_timestamp)}</td>
                  <td>{post.isPosted ? getDate(post.post_timestamp) : 'N/A'}</td>
                  <td>{post.postTo}</td>
                </tr>
              ))}
            </tbody>
        </table>
      </div> : <div>No posts scheduled to be posted yet</div>}
    </div>
  )
}

export default List
