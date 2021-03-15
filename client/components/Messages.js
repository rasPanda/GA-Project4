import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { getLoggedInUserId } from '../lib/auth'
import moment from 'moment'

export default function Messages() {
  const token = localStorage.getItem('token')
  const profileId = getLoggedInUserId()
  const [received, getReceived] = useState([])
  const [sent, getSent] = useState([])
  const [loading, updateLoading] = useState(true)

  useEffect(() => {
    async function fetchMessages() {
      try {
        await axios.get(`/api/profile/${profileId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => {
            console.log(res.data)
            getReceived(res.data.messages_received)
            getSent(res.data.messages_sent)
          })
        updateLoading(false)
      } catch (err) {
        console.log(err.response)
      }

    }
    fetchMessages()
  }, [])

  // console.log(received)
  console.log(sent)

  if (loading) {
    return <main>
      <div>
        Loading messages
      </div>
    </main>
  }

  return <main>
    <h2>Messages</h2>
    <h3>Received</h3>
    {!received ? received.map((message) => {
      return <div key={message.id}>
        <div>From: {message.sender.username}</div>
        <div>{message.text}</div>
      </div>
    })
      :
      <div>No messages!</div>
    }
    <h3>Sent</h3>
    {sent.map((message) => {
      return <div key={message.id}>
        <div>To: {message.recipient.username}</div>
        <div>{message.text}</div>
      </div>
    })}
  </main>
}