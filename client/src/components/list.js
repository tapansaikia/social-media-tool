import React, { useState } from 'react'

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
    <div>
      <button onClick={fetchPosts}>Fetch Posts</button>
      <div>
          <h2>All Posts</h2>
          <table>
            <thead>
              <tr>
                <th>Post ID</th>
                <th>Post Body</th>
                <th>Scheduled For</th>
                <th>Posted At</th>
                <th>Posted On Platform</th>
              </tr>
            </thead>
            {posts.length ? <tbody>
              {posts.map((post, index) => (
                <tr key={index}>
                  <td>{post.postId}</td>
                  <td>{post.postBody}</td>
                  <td>{getDate(post.post_timestamp)}</td>
                  <td>{post.isPosted ? getDate(post.post_timestamp) : 'N/A'}</td>
                  <td>{post.postTo}</td>
                </tr>
              ))}
            </tbody> : null}
          </table>
        </div>
    </div>
  )
}

export default List
