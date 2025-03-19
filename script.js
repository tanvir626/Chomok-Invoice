
    // Function to add a new product row
    function addRow() {
        let table = document.getElementById("invoiceTable");
        let newRow = table.insertRow();
        newRow.innerHTML = `
            <td>
                <select class="form-control product-select" onchange="updatePrice(this)">
                    <option value="100">Chomok 100mg - 100 TK</option>
                    <option value="50">Chomok 50mg - 50 TK</option>
                </select>
            </td>
            <td><input type="number" class="form-control qty" value="1" min="1" oninput="calculateTotal()"></td>
            <td><input type="text" class="form-control price" value="100" readonly></td>
            <td><input type="text" class="form-control subtotal" value="100" readonly></td>
            <td><span class="remove-btn" onclick="removeRow(this)">❌</span></td>
        `;
        calculateTotal();
    }

    // Function to remove a product row
    function removeRow(button) {
        let row = button.parentElement.parentElement;
        row.remove();
        calculateTotal();
    }

    // Update the price and subtotal based on selected product
    function updatePrice(selectElement) {
        let row = selectElement.parentElement.parentElement;
        let priceField = row.querySelector(".price");
        let quantityField = row.querySelector(".qty");
        let subtotalField = row.querySelector(".subtotal");

        priceField.value = selectElement.value;
        subtotalField.value = (parseInt(selectElement.value) * parseInt(quantityField.value)).toFixed(2);

        calculateTotal();
    }

    // Calculate total amount including VAT
    function calculateTotal() {
        let total = 0;
        let vat = 0;
        document.querySelectorAll("#invoiceTable tr").forEach(row => {
            let qty = row.querySelector(".qty").value;
            let price = row.querySelector(".price").value;
            let subtotal = qty * price;
            row.querySelector(".subtotal").value = subtotal.toFixed(2);
            total += subtotal;
        });
        vat = total * 0.15; // VAT is 15%
        total += vat;

        document.getElementById("totalAmount").innerText = total.toFixed(2);
        document.getElementById("vatAmount").innerText = vat.toFixed(2);
    }

    // Validate form before submission
    function validateForm() {
        var customerName = document.getElementById('customerName').value;
        var customerMobile = document.getElementById('customerMobile').value;
        var customerAddress = document.getElementById('customerAddress').value;
        var customerType = document.getElementById('customerType').value;

        // Check if customer info fields are empty
        if (!customerName || !customerMobile || !customerAddress || !customerType) {
            alert("Please fill in all customer information fields.");
            return false;
        }

        // Product Table Validation
        var invoiceTable = document.getElementById('invoiceTable');
        if (invoiceTable.rows.length === 0) {
            alert("Please add at least one product to the invoice.");
            return false;
        }

        for (var i = 0; i < invoiceTable.rows.length; i++) {
            var productSelect = invoiceTable.rows[i].cells[0].querySelector('select');
            var qty = invoiceTable.rows[i].cells[1].querySelector('input').value;

            if (!productSelect.value || qty <= 0) {
                alert("Please select a product and enter a valid quantity for all products.");
                return false;
            }
        }

        return true;
    }

    // Generate and print the invoice
    function generateInvoice() {
        // Populate invoice header info
        const now = new Date();
        document.getElementById('invoiceDate').textContent = now.toISOString().split('T')[0];
        document.getElementById('dueDate').textContent = new Date(now.setDate(now.getDate() + 15)).toISOString().split('T')[0];

        // Populate customer info
        document.getElementById('invoiceCustomerName').textContent = document.getElementById('customerName').value;
        document.getElementById('invoiceCustomerMobile').textContent = document.getElementById('customerMobile').value;
        document.getElementById('invoiceCustomerAddress').textContent = document.getElementById('customerAddress').value;
        document.getElementById('invoiceCustomerType').textContent = document.getElementById('customerType').value;

        // Populate product details
        const invoiceTable = document.getElementById('invoiceTable');
        const invoiceProducts = document.getElementById('invoiceProducts');
        invoiceProducts.innerHTML = '';

        let subtotal = 0;
        for (let i = 0; i < invoiceTable.rows.length; i++) {
            const row = invoiceTable.rows[i];
            const productSelect = row.querySelector('select');
            const productName = productSelect.options[productSelect.selectedIndex].text;
            const qty = row.querySelector('.qty').value;
            const price = row.querySelector('.price').value;
            const total = (qty * price).toFixed(2);

            invoiceProducts.innerHTML += `
                <tr>
                    <td>${productName}</td>
                    <td>${price} TK</td>
                    <td>${qty}</td>
                    <td>${total} TK</td>
                </tr>
            `;

            subtotal += parseFloat(total);
        }

        // Calculate totals
        const vat = subtotal * 0.15;
        const grandTotal = subtotal + vat;

        document.getElementById('subtotalAmount').textContent = subtotal.toFixed(2);
        document.getElementById('vatAmount').textContent = vat.toFixed(2);
        document.getElementById('grandTotal').textContent = grandTotal.toFixed(2);

        // Show invoice section
        document.getElementById('invoiceSection').style.display = 'block';
    }

    // Generate PDF from invoice
    function generatePDF() {
        if (!validateForm()) return;

        generateInvoice();

        // Prepare content for printing
        const printContent = document.getElementById('invoiceSection').outerHTML;
        const originalContent = document.body.innerHTML;

        // Create a new window for printing
        const printWindow = window.open('', '', 'width=800, height=600');
        printWindow.document.write(`
            <html>
            <head>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body { font-family: Arial, sans-serif; }
                    table { width: 100%; margin-top: 20px; }
                    td, th { padding: 8px; text-align: left; }
                </style>
            </head>
            <body>
                ${printContent}
            </body>
            </html>
        `);
        document.getElementById('invoiceSection').style.display = 'none'; // Hide the invoice section
        printWindow.document.close(); // Ensure content is loaded
        printWindow.print(); // Trigger print dialog
        // Close the window after printing
    }
