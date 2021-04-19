import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { getLoggedInUserId } from '../lib/auth'

export default function UserProfile({ match }) {
  const token = localStorage.getItem('token')
  const profileId = match.params.id
  const [ownProfile, setOwnProfile] = useState(false)
  const [profile, getProfile] = useState({})
  const [followConf, updateFollowConf] = useState('')
  const [followers, setFollowers] = useState([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [uploadSuccess, updateUploadSuccess] = useState(false)
  const [newProfilePicture, getNewProfilePicture] = useState({})

  useEffect(() => {
    async function getProfileData() {
      try {
        await axios.get(`/api/profile/${profileId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => {
            getProfile(res.data)
            setFollowers(res.data.followers)
          })
      } catch (err) {
        console.log(err.response)
      }
    }
    if (profileId === String(getLoggedInUserId())) {
      setOwnProfile(true)
    }
    getProfileData()
  }, [isFollowing, uploadSuccess])

  useEffect(() => {
    for (let index = 0; index < followers.length; index++) {
      console.log(followers[index].id)
      if (followers[index].id === getLoggedInUserId()) {
        setIsFollowing(true)
      }
    }
  }, [followers])

  async function follow() {
    try {
      await axios.post(`/api/follow/${profileId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          updateFollowConf(res.data.messages)
        })
    } catch (err) {
      updateFollowConf(err.response.data.messages)
    }
    setIsFollowing(!isFollowing)
  }

  async function unfollow() {
    try {
      await axios.delete(`/api/follow/${profileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          updateFollowConf(res.data.messages)
        })
    } catch (err) {
      updateFollowConf(err.response.data.messages)
    }
    setIsFollowing(!isFollowing)
  }

  function handleUpload(event) {
    event.preventDefault()
    window.cloudinary.createUploadWidget(
      {
        cloudName: `${process.env.cloudName}`,
        uploadPreset: `${process.env.uploadPreset}`,
        cropping: true
      },
      (_err, result) => {
        if (result.event !== 'success') {
          return
        }
        getNewProfilePicture({
          image: `${result.info.secure_url}`
        })
        updateUploadSuccess(true)
      }
    ).open()
  }

  useEffect(() => {
    async function uploadPicture() {
      await axios.put('/api/profile', newProfilePicture, {
        headers: { Authorization: `Bearer ${token}` }
      })
      updateUploadSuccess(false)
    }
    if (uploadSuccess === true) {
      uploadPicture()
    }
  }, [uploadSuccess])


  return <main className='hero mr-6'>
    <section className="section is-small has-text-centered">
      <h2 className='title is-2'>{profile.username}</h2>
    </section>
    <section className="section has-text-centered">
      <div className='container'>
        <div className='columns is-centered is-mobile'>
          <div className='column is-two-thirds'>
            <div id='profile-box' className='mb-2'>
              <img id='profile-img' src={profile.image} alt={'Profile picture'} />
            </div>
          </div>
        </div>
      </div>
      {ownProfile && <button className="button m-4" onClick={handleUpload}>Change profile picture</button>}
      {uploadSuccess && <div><small className="has-text-primary">Upload Complete</small></div>}
      <div className='subtitle is-4'>Following: {profile.following ?
        profile.following.length
        :
        0}</div>
      <div className='subtitle is-4'>Followers: {profile.followers ?
        profile.followers.length
        :
        0}</div>
      {(!ownProfile && !isFollowing) && <button className='button m-2' onClick={() => follow()}>Follow</button>}
      {(!ownProfile && isFollowing) && <button className='button m-2' onClick={() => unfollow()}>Unfollow</button>}
      {followConf && <div>{followConf}</div>}
    </section>
    <section className="section is-large"></section>
  </main>
}