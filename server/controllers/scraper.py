# pylint: disable=import-error
from flask import Blueprint, request
from gazpacho import get, Soup

router = Blueprint(__name__, "scraper")

@router.route("/scrape", methods=["GET"])
def scrape():
    url = request.args.get('url')
    html = get(url)
    soup = Soup(html)

    name = (soup.find('meta', attrs={'property': "og:title"}, mode='first'))
    if name != None:
        name = name.attrs['content']
    else:
        name = (soup.find('title', mode='first')).text

    description = soup.find('meta', attrs={'property': "og:description"}, mode='first')
    if description != None:
        description = description.attrs['content']
    else:
        description = soup.find('meta', attrs={'name': "description"}, mode='first')
        if description != None:
            description = description.attrs['content']

    image = soup.find('meta', attrs={'property': "og:image"}, mode='first')
    if image != None:
        image = image.attrs['content']
    else:
        image = soup.find('meta', attrs={'name': "image"}, mode='first')
        if image != None:
            image = image.attrs['content']

    price = soup.find('meta', attrs={'property': "og:price:amount"}, mode='first')
    if price != None:
        price = price.attrs['content']
    else:
        price = soup.find('meta', attrs={'name': "price"}, mode='first')
        if price != None:
            price = price.attrs['content']

    vendor = soup.find('meta', attrs={'property': "og:site_name"}, mode='first')
    if vendor != None:
        vendor = vendor.attrs['content']
    else:
        vendor = soup.find('meta', attrs={'name': "site_name"}, mode='first')
        if vendor != None:
            vendor = vendor.attrs['content']


    return {
        "name": name if name != None else '',
        "description": description if description != None else '',
        "image": image if image != None else '',
        "price": price if price != None else '',
        "vendor": vendor if vendor != None else '',
        "url": url
        }, 200