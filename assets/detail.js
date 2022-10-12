// Add SDK credentials
// REPLACE WITH YOUR PUBLIC KEY AVAILABLE IN: https://developers.mercadopago.com/panel
const mercadopago = new MercadoPago('APP_USR-ff96fe80-6866-4888-847e-c69250754d38', {
    locale: 'es-AR' // The most common are: 'pt-BR', 'es-AR' and 'en-US'
  });
  
  // Handle call to backend and generate preference.
  document.getElementById("btnPago").addEventListener("click", function() {
  
    $('#btnPago').attr("disabled", true);
    const orderData = {
        idprod:randomID(),
        title: document.getElementById("title").innerHTML,
        quantity: document.getElementById("quantity").innerHTML,
        unit_price: document.getElementById("unit_price").innerHTML,
        picture_url: document.getElementById("img").value
    };
      
    fetch("/create_preference", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then(function(response) {
          return response.json();
      })
      .then(function(preference) {
          createCheckoutButton(preference.id);
          
          $(".as-accessories-results").fadeOut(500);
          setTimeout(() => {
              $(".as-producttile-info").show(500).fadeIn();
          }, 500);
      })
      .catch(function() {
          alert("Unexpected error");
          $('#btnPago').attr("disabled", false);
      });
  });
  
  // Create preference when click on checkout button
  function createCheckoutButton(preferenceId) {
    // Initialize the checkout
    mercadopago.checkout({
      preference: {
        id: preferenceId
      },
      render: {
        container: '#button-checkout', // Class name where the payment button will be displayed
        label: 'Pagar la compra', // Change the payment button text (optional)
      }
    });
  }
  function randomID(){
    return Math.floor(Math.random() * 9000) + 1000; // Retonar un numero entre 1000 y 9999
  }
  