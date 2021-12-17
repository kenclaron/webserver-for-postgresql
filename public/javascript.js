const textareas = {
  result: document.getElementById("ajax-result"),
  send: document.getElementById("ajax-send")
}

const buttons = {
  getProducts: document.getElementById("button-get-products"),
  getLimitProducts: document.getElementById("button-get-limit-products"),
  getProductById: document.getElementById("button-get-id-products"),
  postCreateProduct: document.getElementById("button-post-create-product"),
  putUpdateProduct: document.getElementById("button-put-update-product"),
  deleteProduct: document.getElementById("button-delete-product"),
  uploadImage: document.getElementById("button-upload-image"),
  copy: {
    textareaResult: document.getElementById("button-textarea-ajax-result-copy"),
    textareaSend: document.getElementById("button-textarea-ajax-send-copy")
  },
  clear: {
    textareaResult: document.getElementById("button-textarea-ajax-result-clear"),
    textareaSend: document.getElementById("button-textarea-ajax-send-clear")
  }
}

/**
 * More beauty JSON response text
 * @param {String} responseText
 * @returns {String} responseText
 */
function BeautifyResponse(responseText) {
  return responseText.replace(/{/g, '{\n')
  .replace(/}/g, '\n}')
  .replace(/,/g, ',\n');
}

/**
 * Copy text from <textarea> in clipboard
 * @param {HTMLElement} element 
 * @returns {Boolean}
 */
function CopyToClipboard(element)
{
  element.select();
  document.execCommand('copy');
  return true;
}

class RequestController {
  constructor() {   }
  
  CreateHttpRequest(method, url, body = "") {
    let request = new XMLHttpRequest();
    
    request.open(method, url);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(body);

    return request;
  }

  async CheckRequest(listener) {
    return listener.target.readyState === 4 && listener.target.status === 200;
  }

  async GetProducts() {
    this.CreateHttpRequest('GET', '/api/products').addEventListener("readystatechange", (listener) => {
      if (this.CheckRequest(listener)) {
        textareas.result.value = BeautifyResponse(listener.target.responseText);
      }
    });
  }

  async GetLimitProducts(limit = 5, page = 1) {
    this.CreateHttpRequest('GET', `/api/products?limit=${limit}&page=${page}`).addEventListener("readystatechange", (listener) => {
      if (this.CheckRequest(listener)) {
        textareas.result.value = BeautifyResponse(listener.target.responseText);
      }
    });
  }

  async GetOneProduct(id) {
    this.CreateHttpRequest('GET', `/api/products/${id}`).addEventListener("readystatechange", (listener) => {
      if (this.CheckRequest(listener)) {
        textareas.result.value = BeautifyResponse(listener.target.responseText);
      }
    });
  }

  async CreateProduct(body) {
    this.CreateHttpRequest('POST', '/api/products', body).addEventListener("readystatechange", (listener) => {
      if (this.CheckRequest(listener)) {
        textareas.result.value = BeautifyResponse(listener.target.responseText);
      }
    });
  }

  async UpdateProduct(body) {
    this.CreateHttpRequest('PUT', `/api/products`, body).addEventListener("readystatechange", (listener) => {
      if (this.CheckRequest(listener)) {
        textareas.result.value = BeautifyResponse(listener.target.responseText);
      }
    });
  }

  async DeleteProduct(id) {
    this.CreateHttpRequest('DELETE', `/api/products/${id}`).addEventListener("readystatechange", (listener) => {
      console.log(listener)
      if (this.CheckRequest(listener)) {
        textareas.result.value = BeautifyResponse(listener.target.responseText);
      }
    });
  }

  async UploadImage(id) {
    let response = await fetch(`/api/products/upload/${id}`, {
      method: 'POST',
      body: new FormData(document.getElementById("form-upload-image"))
    });
    document.getElementById("input-image-file").value = null;
    return await response.json();
  }
}

const requestController = new RequestController();

buttons.getProducts.onclick = () => requestController.GetProducts();
buttons.getLimitProducts.onclick = () => requestController.GetLimitProducts(document.getElementById("input-number-limit-id").value, document.getElementById("input-number-page-id").value);
buttons.getProductById.onclick = () => requestController.GetOneProduct(document.getElementById("input-number-get-id").value);
buttons.postCreateProduct.onclick = () => requestController.CreateProduct(textareas.send.value);
buttons.putUpdateProduct.onclick = () => requestController.UpdateProduct(textareas.send.value);
buttons.deleteProduct.onclick = () => requestController.DeleteProduct(document.getElementById("input-number-delete-id").value);

document.getElementById("form-upload-image").onsubmit = async (event) => { 
  requestController.UploadImage(document.getElementById("input-number-photo-id").value)
  event.preventDefault();
}

textareas.send.value = '{\n"name": "book",\n"price": 800,\n"amount": 1000\n}';
buttons.postCreateProduct.removeAttribute("disabled");

textareas.send.addEventListener('input', () => {
  if(textareas.send.value.length == 0) {
    buttons.postCreateProduct.setAttribute("disabled", "");
    buttons.putUpdateProduct.setAttribute("disabled", "");
  }
  else {
    if(textareas.send.value.includes('"id":')) {
      buttons.putUpdateProduct.removeAttribute("disabled");
      buttons.postCreateProduct.setAttribute("disabled", "");
    }
    else {
      buttons.putUpdateProduct.setAttribute("disabled", "");
      buttons.postCreateProduct.removeAttribute("disabled");
    }
  }
});

buttons.clear.textareaResult.onclick = () => textareas.result.value = "";
buttons.clear.textareaSend.onclick = () => textareas.send.value = "";
buttons.copy.textareaResult.onclick = () => CopyToClipboard(textareas.result);
buttons.copy.textareaSend.onclick = () => CopyToClipboard(textareas.send);