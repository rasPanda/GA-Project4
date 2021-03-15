import React, { useState } from 'react'
import axios from 'axios'

export default function CreateProduct({ history }) {
  // const token = localStorage.getItem('token')

  const [scraper, runScraper] = useState(false)
  const [scrapeError, updateScrapeError] = useState('')
  const [counter, setCounter] = useState(0)

  const [scraperUrl, updateScraperUrl] = useState('')
  const [scrapedData, updateScrapedData] = useState({})
  const [imgHelp, showImgHelp] = useState(false)

  function handleScraperChange(event) {
    updateScraperUrl(event.target.value)
  }

  function handleScraperSubmit(event) {
    event.preventDefault()
    if (!scraperUrl) {
      updateScrapeError('Please provide a URL!')
      return
    }
    setCounter(counter + 1)
    try {
      axios.get(`/api/scrape?url=${scraperUrl}`)
        .then(res => {
          updateScrapedData(res.data)
          setCounter(0)
          runScraper(true)
        })
    } catch (err) {
      console.log(err.message)
      updateScrapeError('No response. Please check the URL and try again!')
    }
  }

  function handleFormChange(event) {
    const { name, value } = event.target
    updateScrapedData({ ...scrapedData, [name]: value })
  }

  function handleFormSubmit() {

  }

  console.log(scrapedData)

  return <main>
    <button type='button' onClick={() => window.history.back()}>Cancel</button>
    {scraper === true ?
      <form onSubmit={handleScraperSubmit}>
        <h2>Copy and paste the items&apos; product URL here:</h2>
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
        <h2>Confirm & complete the item details below</h2>
        <div>
          <label>Name</label>
          <input
            type='text'
            value={scrapedData.name}
            onChange={handleFormChange}
            name='name'
            placeholder='Item name...'
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            type='text'
            value={scrapedData.description}
            onChange={handleFormChange}
            name='description'
            placeholder='Item description...'
          />
        </div>
        <div>
          <label>Image</label>
          <input
            type='url'
            value={scrapedData.name}
            onChange={handleFormChange}
            name='image'
            placeholder='Image url...'
          />
          <button type='button' onClick={() => showImgHelp(!imgHelp)}>Help</button>
          {imgHelp && <div>(Right click on the product image, and click &quot;Copy image address&quot; to copy!)</div>}
        </div>
        <div>
          <label>Website</label>
          <input
            type='text'
            value={scrapedData.vendor}
            onChange={handleFormChange}
            name='vendor'
            placeholder='Website...'
          />
        </div>
        <div>
          <label>Brand</label>
          <input
            type='text'
            value={scrapedData.vendor}
            onChange={handleFormChange}
            name='vendor'
            placeholder='Website...'
          />
        </div>
      </form>
    }

    {/* <button type='button' onClick={() => window.history.back()}>Cancel</button>
    <form onSubmit={handleSubmit}>
      <h2>Create a new list</h2>
      <div>
        <label>List name</label>
        <input 
          type='text'
          value={boardName}
          onChange={handleChange}
          name='listName'
          placeholder='My new list'
        />
      </div>
      <button>Create list</button>
    </form> */}
  </main>
}