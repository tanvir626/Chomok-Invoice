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

function removeRow(button) {
    let row = button.parentElement.parentElement;
    row.remove();
    calculateTotal();
}

function updatePrice(selectElement) {
    let row = selectElement.parentElement.parentElement;
    let priceField = row.querySelector(".price");
    let quantityField = row.querySelector(".qty");
    let subtotalField = row.querySelector(".subtotal");

    priceField.value = selectElement.value;
    subtotalField.value = (parseInt(selectElement.value) * parseInt(quantityField.value)).toFixed(2);

    calculateTotal();
}

function calculateTotal() {
    let total = 0;
    document.querySelectorAll("#invoiceTable tr").forEach(row => {
        let qty = row.querySelector(".qty").value;
        let price = row.querySelector(".price").value;
        let subtotal = qty * price;
        row.querySelector(".subtotal").value = subtotal.toFixed(2);
        total += subtotal;
    });
    document.getElementById("totalAmount").innerText = total.toFixed(2);
}

function printInvoice() {
let invoice = document.querySelector('.invoice-container').innerHTML;
let originalContent = document.body.innerHTML;

document.body.innerHTML = invoice;
window.print();
document.body.innerHTML = originalContent;
}
