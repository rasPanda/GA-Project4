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
      return
    }
    setCounter(counter + 1)
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
      console.log(err.response.data)
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
    <button type='button' onClick={() => window.history.back()}>Cancel</button>
    <section className="hero-body mt-0 mr-6 columns is-centered">
      {scraper === false ?
        <form onSubmit={handleScraperSubmit}>
          <h2>Copy and paste the items&apos; product URL here:</h2>
          {loading && <div>LOADING</div>}
          <div>
            <input
              type='text'
              value={scraperUrl}
              onChange={handleScraperChange}
              name='scraperUrl'
              placeholder='Product page URL...'
            />
          </div>
          <button>Next</button>
          {scrapeError && <div>{scrapeError}</div>}
          {counter >= 3 && <div>Having trouble? <button>Skip this step</button></div>}
        </form>
        :
        <form onSubmit={handleFormSubmit}>
          <button type='button' onClick={() => runScraper(false)}>Go back</button>
          <h2>Confirm & complete the item details below</h2>
          <div>
            <label>Name</label>
            <input
              type='text'
              value={formData.name}
              onChange={handleFormChange}
              name='name'
              placeholder='Item name...'
            />
          </div>
          <div>
            <label>Description</label>
            <textarea
              type='text'
              value={formData.description}
              onChange={handleFormChange}
              name='description'
              placeholder='Item description...'
            />
          </div>
          <div>
            <label>Image</label>
            <input
              type='url'
              value={formData.image}
              onChange={handleFormChange}
              name='image'
              placeholder='Image url...'
            />
            <button type='button' onClick={() => showImgHelp(!imgHelp)}>Help</button>
            {imgHelp && <div>(Right click on the product image, and click &quot;Copy image address&quot; to copy!)</div>}
            <img width='100%' src={formData.image || null} />
          </div>
          <div>
            <label>Seller</label>
            <input
              type='text'
              value={formData.vendor}
              onChange={handleFormChange}
              name='vendor'
              placeholder='Seller website...'
            />
          </div>
          <div>
            <label>Price</label>
            <input
              type='text'
              value={formData.price}
              onChange={handleFormChange}
              name='price'
              placeholder='Item price...'
            />
          </div>
          <button>Confirm</button>
          {errors && <div>{errors}</div>}
        </form>
      }
    </section>
  </main>
}