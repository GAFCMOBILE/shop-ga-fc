document.addEventListener("DOMContentLoaded", function () {
    // Khi nhấn vào nút Sửa
    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", function () {
            document.getElementById("form-title").innerText = "Chỉnh sửa sản phẩm";
            document.getElementById("product-id").value = this.dataset.id;
            document.getElementById("product-name").value = this.dataset.name;
            document.getElementById("product-price").value = this.dataset.price;
        });
    });

    // Khi submit form
    document.getElementById("product-form").addEventListener("submit", function (event) {
        let productId = document.getElementById("product-id").value;
        if (productId) {
            this.action = "/edit-product/" + productId;
        }
    });
});
