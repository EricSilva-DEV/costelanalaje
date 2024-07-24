const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closekoutBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById('address-warn');

let cart = [];


// Modal do carrinho //
cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex"
})

// Fechar modal do carrinho clicando fora //
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

// Fechar modal clicando no botão fechar! //
closekoutBtn.addEventListener('click', function () {
  cartModal.style.display = 'none';
})

// Add item ao modal //
menu.addEventListener("click", function(event) {
    // console.log(event.target)

    let parentButton = event.target.closest(".add-to-cart-btn") // Nessa linha buscamos nome e preço do item
    
    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name,price)

    }
})

// Função para add ao carrinho //
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
        name,
        price,
        quantity: 1,
    })
    }
        
    updateCartModal()
}

// Atualização do carrinho //
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex","justify-between", "mb-4", "flex-col")
        
        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between bg-gray-50 px-5 py-3">
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Qtd:${item.quantity}</p>
                <p class="font-bold mt-2 text-green-600">R$ ${item.price.toFixed(2)}</p>
            </div>
            <div>
                <button class="remove-from-cart-btn" data-name="${item.name}" >
                    Remover
                </button>
            </div>
        </div>
        `
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    cartCounter.innerHTML = cart.length;

}

cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")
        
        removeItemCart(name);
        }
})
    
function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }

})

checkoutBtn.addEventListener("click", function(){
    const isOpen = checkRestauranteOpen();
    if (!isOpen) {
        
        Toastify({
          text: 'Desculpe, estamos fechados no momento!',
          duration: 3000,
          close: true,
          gravity: 'top', // `top` or `bottom`
          position: 'right', // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "#ef4444",
          },
        }).showToast();

        return;
    }
   
    if (cart.length === 0) return;
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    // Enviar pedido no whatsApp //
    // const cartItems = cart
    //   .map((item) => {
    //     return ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} `;
    //   })
    //   .join("");

    const cartItems = cart
      .map((item) => {
        return `**${item.name}** Quantidade: (${item.quantity}) Preço: R$${item.price}`;
      })
      .join("\n");

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    
    const message = encodeURIComponent(
      `Novo pedido:\n\n${cartItems}\n\n**Total: R$${total.toFixed(2)}**`
    );
    const phone = "5521979080487"

    window.open(`https://wa.me/${phone}?text=${message} Endereço:${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();
})



// Verificar e validar o horario de funcionamento //
function checkRestauranteOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 10 && hora < 22;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestauranteOpen();

if (isOpen) {
    spanItem.classList.remove('bg-red-500');
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}
