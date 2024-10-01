<?php
// orders.php

$file = 'orders.json';
// Get existing orders
$orders = json_decode(file_get_contents($file), true);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Return the existing orders
    header('Content-Type: application/json');
    echo json_encode($orders);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (isset($input['name']) && isset($input['drink'])) {
        // Generate a unique ID for the new order
        $input['id'] = end($orders)['id'] + 1;

        // Add new order to orders array
        $orders[] = $input;

        // Save updated orders back to file
        file_put_contents($file, json_encode($orders));

        // Return the new order with its ID
        header('Content-Type: application/json');
        echo json_encode($input);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid input']);
    }
}


if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $orderId = $_GET['id'] ?? null;
    $input = json_decode(file_get_contents('php://input'), true);

    if ($orderId && isset($input['name']) && isset($input['drink'])) {
        $orderFound = false;
        foreach ($orders as &$order) {
            if ($order['id'] == $orderId) {
                // Order found, update its details
                $order['name'] = $input['name'];
                $order['drink'] = $input['drink'];
                $orderFound = true;
                break;
            }
        }

        if ($orderFound) {
            // Save updated orders back to the file
            file_put_contents($file, json_encode($orders));
            echo json_encode(['message' => 'Order updated successfully']);
        } else {
            // Order ID was not found
            http_response_code(404);  // Not Found
            echo json_encode(['error' => 'Order not found']);
        }
    } else {
        http_response_code(400);  // Bad Request if inputs are missing
        echo json_encode(['error' => 'Invalid input or order ID']);
    }
}
?>