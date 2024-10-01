
$(function () {

    var $listOrders = $('#list-orders'); // list item
    var $name = $('#name'); // input name
    var $drink = $('#drink'); // input drink

    // Track the current highest ID
    var currentId = 0;

    // Template Create mustache.js
    var orderTemplate = "" +
        "<li data-id='{{id}}'> " +
        "<strong>Name:</strong> <span class='name'>{{name}}</span>" +
        "<strong>Drink:</strong> <span class='drink'>{{drink}}</span>" +
        "<br/>" +
        "<span class='edit'> Name : <span class='noedit name'>{{name}}</span> </span><input class='edit name'>" +
        "<span class='edit'> Drink : <span class='noedit drink'>{{drink}}</span></span><input class='edit drink'>" +
        "<button class='removeOrder' data-id='{{id}}'>Remove</button>" +
        "<button class='editOrder noedit'>Edit</button>" +  // Fixed the extra single quote here
        "<button class='cancelEdit edit'>Cancel</button>" +  // Fixed the extra single quote here
        "<button class='saveEdit edit'>Save</button>" +
        "</li>";

    function addOrder(list){
        //$listOrders.append('<li>Name: '+ order.name +' '+ order.drink +'</li>');
        $listOrders.append(Mustache.render(orderTemplate, list));
    }

    $.ajax({
        type: 'GET',
        url: './api/orders.php',
        success: function (orders) {
           // console.log(orders);
            
            $.each(orders, function( index, value ) {
                //alert( index + ": " + value );
                //$listOrders.append('<li>Name: '+ value.name +' '+ value.drink +'</li>');
                addOrder(value);
                // Update currentId with the highest id
                if (value.id > currentId) {
                    currentId = value.id;
                }
            });
        },
        error: function (){
            console.log('error loading orders');
        }
    });


    // button Click add data
    $('#add-order').on('click', function (){
        //alert('button click');
        var orderlistInput = {
            id: ++currentId,  // Increment the current ID
            name: $name.val(),
            drink: $drink.val()
        };
       // console.log(orderlistInput);

        // POST the order list
        $.ajax({
            type: 'POST',
            url: './api/orders.php',
            data: JSON.stringify(orderlistInput), // Send as JSON
            contentType: 'application/json', // Specify content type
            success: function (newOrder){
                //console.log(newOrder);
               // $listOrders.append('<li>Name: '+ newOrder.name +' '+ newOrder.drink +'</li>');
                addOrder(newOrder);
            },
            error: function (){
                alert('error saving order');
            }
        });
    });

    // Button Remove

    // Using .delegate() to handle click events on li elements

   $listOrders.delegate('.removeOrder', 'click', function (){

       var $li = $(this).closest('li');
       var orderId = $li.attr('data-id');  // Use .attr('data-id') to get the data-id attribute value
       console.log('DELETE Removing order with ID:', orderId);  // Debugging: Log the ID

     $.ajax({
         type: 'DELETE',
         url: './api/orders.php?id=' + orderId,  // Adjusting the URL to include the ID parameter
         success: function (){
             // Remove the <li> element from the DOM after successful deletion
             //$li.remove();
             $li.fadeOut(300, function (){
                $(this).remove();
             })
             console.log('Order deleted successfully');
         },
         error: function () {
             console.log('Error deleting the order');
         }
     });
   });

    // Using .delegate() to handle click events on li elements
    // $('#list-orders').delegate('.remove', 'click', function() {
    //     alert($(this).text() + ' clicked');
    // });

    // Edit Button
    $listOrders.delegate('.editOrder', 'click', function (){
       var $li = $(this).closest('li');
        $li.find('input.name').val($li.find('span.name').html());
        $li.find('input.drink').val($li.find('span.drink').html());
        $li.addClass('edit');
        console.log($li)
    });

    // Cancel Button
    $listOrders.delegate('.cancelEdit', 'click', function (){
        var $li = $(this).closest('li');
             $li.removeClass('edit');
        console.log($li)
    });

    // Save Edit Button

    $listOrders.delegate('.saveEdit', 'click', function (){
        var $li = $(this).closest('li');
        var orderId = $li.attr('data-id');  // Use .attr('data-id') to get the data-id attribute value

        if (!orderId) {
            alert('No order ID found');
            return;
        }

        console.log('PUT Updating order with ID:', orderId);  // Debugging: Log the ID

        // Capture updated order details from input fields
        var orderPut = {
            name: $li.find('input.name').val(),
            drink: $li.find('input.drink').val()
        };
        console.log("edit input",orderPut);

        // PUT the order list
        $.ajax({
            type: 'PUT',
            url: './api/orders.php?id=' + orderId,
            data: JSON.stringify(orderPut),
           contentType: 'application/json',  // Add this line
            success: function (response) {
                console.log("dfdfd",response);
                // Update the UI with the new values
                $li.find('span.name').html(orderPut.name);
                $li.find('span.drink').html(orderPut.drink);
                $li.removeClass('edit');  // Exit edit mode
            },
            error: function (xhr, status, error) {
                console.error('Error updating order:', status, error);
                alert('Failed to update the order.');
            }
        });
    });
});