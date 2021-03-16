import React, { useState } from 'react'
import axios from 'axios'

export default function CreateProduct({ history, location }) {
  const token = localStorage.getItem('token')
  const [loading, updateLoading] = useState(false)
  const [imgHelp, showImgHelp] = useState(false)
  const [scraper, runScraper] = useState(false)
  const [scrapeError, updateScrapeError] = useState('')
  const [counter, setCounter] = useState(0)
  const [scraperUrl, updateScraperUrl] = useState('')
  const [errors, updateErrors] = useState('')


  const [formData, updateFormData] = useState({
    name: '',
    description: '',
    image: '',
    vendor: '',
    price: '',
    dest_url: ''
  })

  function handleScraperChange(event) {
    updateScraperUrl(event.target.value)
  }

  async function handleScraperSubmit(event) {
    updateScrapeError('')
    updateLoading(true)
    event.preventDefault()
    if (!scraperUrl) {
      updateScrapeError('Please provide a URL!')
      updateLoading(false)
      return
    }
    const search = await axios.get(`/api/product/search?url=${scraperUrl}`)
    if (search.data.messages !== 'No duplicate') {
      updateScrapeError('Product found!')
      addProductToBoard(search.data.id)
      return
    }
    try {
      await axios.get(`/api/scrape?url=${scraperUrl}`)
        .then(res => {
          setCounter(0)
          runScraper(true)
          updateFormData(res.data)
        })
    } catch (err) {
      updateScrapeError('No response. Please check the URL and try again!')
      setCounter(counter + 1)
    }
    updateLoading(false)
  }

  function handleFormChange(event) {
    const { name, value } = event.target
    updateFormData({ ...formData, [name]: value })
  }

  async function handleFormSubmit(event) {
    event.preventDefault()
    updateErrors('')
    for (const [key, value] of Object.entries(formData)) {
      if (value === '') {
        updateErrors(`${key} information cannot be empty!`)
        return
      }
    }
    try {
      await axios.post('/api/product', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          addProductToBoard(res.data.id)
        })
    } catch (err) {
      updateErrors(err.response.data.messages)
    }
  }

  async function addProductToBoard(productId) {
    try {
      await axios.post(`/api/product/${productId}/board${location.state.boardId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (err) {
      updateScrapeError(err.response.data.messages)
      updateErrors(err.response.data.messages)
    }
    setTimeout(() => {
      history.push(`/board/${location.state.boardId}`)
    }, 1000)
  }

  return <main className="hero is-fullheight-with-navbar">
    <button className='button mr-6' onClick={() => window.history.back()}>Cancel</button>
    <section className="hero-body mt-0 mr-6 columns is-centered">
      {scraper === false ?
        <div className="column is-half is-vcentered">
          <h2 className="title is-5">Copy and paste the items&apos; product URL here:</h2>
          <form onSubmit={handleScraperSubmit}>
            {loading && <div>LOADING</div>}
            <div className="field has-addons">
              <div className='control is-expanded'>
                <input
                  className='input'
                  type='text'
                  value={scraperUrl}
                  onChange={handleScraperChange}
                  name='scraperUrl'
                  placeholder='Product page URL...'
                />
              </div>
              <div className="control">
                <button className='button'>Next</button>
              </div>
            </div>
            {scrapeError && <div>{scrapeError}</div>}
            {counter >= 3 && <div>
              <div>Having trouble?</div>
              <button className='button' onClick={() => runScraper(true)}>Skip this step</button>
            </div>}
          </form>
        </div>
        :
        <div className="column is-half is-vcentered">
          <button className='button mb-3' onClick={() => runScraper(false)}>Go back</button>
          <form onSubmit={handleFormSubmit}>
            <h2 className="title is-5">Confirm & complete the item details below</h2>
            <div className="field">
              <label className="label">Name</label>
              <input
                className='input'
                type='text'
                value={formData.name}
                onChange={handleFormChange}
                name='name'
                placeholder='Item name...'
              />
            </div>
            <div className="field">
              <label className="label">Description</label>
              <textarea
                className='textarea'
                rows='5'
                type='text'
                value={formData.description}
                onChange={handleFormChange}
                name='description'
                placeholder='Item description...'
              />
            </div>
            <div className="field has-addons">
              <div className='control is-expanded'>
                <label className="label">Image</label>
                <input
                  className='input'
                  type='url'
                  value={formData.image}
                  onChange={handleFormChange}
                  name='image'
                  placeholder='Image url...'
                />
                <button type='button' onClick={() => showImgHelp(!imgHelp)}>Help</button>
              </div>
              {imgHelp && <div className='modal is-active'>
                <div className='modal-background'></div>
                <div className='modal-content has-text-centered'>
                  <p className='modal-text'>1. Go to the product page, and find the right picture</p>
                  <p className='modal-text'>2. Right click on the product image (hold down click on mobile)</p>
                  <p className='modal-text'>3. Click &quot;Copy image address&quot; to copy the link</p>
                  <p className='modal-text'>4. Paste the link in the form!</p>
                </div>
                <button className='modal-close is-large' aria-label='close' onClick={() => showImgHelp(false)} />
              </div>}
            </div>
            <img width='100%' src={formData.image || null} />
            <div className="field">
              <label className="label">Seller</label>
              <input
                className='input'
                type='text'
                value={formData.vendor}
                onChange={handleFormChange}
                name='vendor'
                placeholder='Seller name...'
              />
            </div>
            <div className="field">
              <label className="label">Price</label>
              <input
                className='input'
                type='text'
                value={formData.price}
                onChange={handleFormChange}
                name='price'
                placeholder='Item price...'
              />
            </div>
            <div className='control'>
              <button className='button'>Confirm</button>
            </div>
            {errors && <div className='help'>{errors}</div>}
          </form>
        </div>
      }
    </section>
  </main>
}