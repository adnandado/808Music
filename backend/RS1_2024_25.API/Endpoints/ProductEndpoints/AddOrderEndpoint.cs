using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data.Models.Mail;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Endpoints.ProductEndpoints;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services.Interfaces;
using static OrderAddEndpoint;
using System.Text;
using Microsoft.EntityFrameworkCore;

public class OrderAddEndpoint : MyEndpointBaseAsync
    .WithRequest<OrderAddRequest>
    .WithResult<OrderAddResponse>
{
    private readonly ApplicationDbContext _db;
    private readonly IMyMailService _mailService;
    private readonly IConfiguration _configuration;

    public OrderAddEndpoint(ApplicationDbContext db, IMyMailService mailService, IConfiguration configuration)
    {
        _db = db;
        _mailService = mailService;
        _configuration = configuration;
    }

    [HttpPost]
    public override async Task<OrderAddResponse> HandleAsync(OrderAddRequest request, CancellationToken cancellationToken = default)
    {
        var cartItems = await _db.UserShoppingCart
            .Where(cart => cart.UserId == request.UserId)
            .Include(cart => cart.Product)
            .ToListAsync(cancellationToken);

        if (!cartItems.Any())
        {
            throw new InvalidOperationException("Shopping cart is empty.");
        }

        decimal totalPrice = 0;
        foreach (var cartItem in cartItems)
        {
            var effectivePrice = (Decimal)cartItem.Product.Price * (1 - cartItem.Product.SaleAmount); 
            totalPrice += effectivePrice * cartItem.Quantity;
        }

        
        var order = new Order
        {
            Status = "Pending",
            TotalPrice = totalPrice,
            OrderDetails = new List<OrderDetails>()
        };

        foreach (var cartItem in cartItems)
        {
            var orderDetail = new OrderDetails
            {
                ProductId = cartItem.ProductId,
                Quantity = cartItem.Quantity,
                UnitPrice = (Decimal)cartItem.Product.Price,
                Discount = cartItem.Product.SaleAmount
            };

            var product = await _db.Products
                .FirstOrDefaultAsync(p => p.Id == cartItem.ProductId, cancellationToken);

            if (product != null && product.QtyInStock >= cartItem.Quantity)
            {
                product.QtyInStock -= cartItem.Quantity;
                product.SoldItems += cartItem.Quantity;
                product.RevenueFromProduct += (Decimal)cartItem.Product.Price * (1 - cartItem.Product.SaleAmount) * cartItem.Quantity;
            }
            else
            {
                throw new InvalidOperationException("Not enough stock for product: " + cartItem.Product.Title);
            }

            order.OrderDetails.Add(orderDetail);
        }

        _db.Order.Add(order);

        await _db.SaveChangesAsync(cancellationToken);

        var userOrder = new UserOrders
        {
            MyAppUserId = request.UserId,  
            OrderId = order.Id
        };

        _db.UserOrders.Add(userOrder);

        _db.UserShoppingCart.RemoveRange(cartItems);

        await _db.SaveChangesAsync(cancellationToken);

        var myAppUser = await _db.MyAppUsers.SingleOrDefaultAsync(u => u.ID == request.UserId, cancellationToken);
        if (myAppUser != null)
        {
            var mailBody = new StringBuilder();
            mailBody.Append("<html><body style='background-color: #f0f0f0; margin: 0; padding: 0;'>");
            mailBody.Append("<div style='width: 100%; background-color: #f0f0f0; padding: 20px; box-sizing: border-box;'>");
            mailBody.Append("<img src='https://i.imgur.com/gZqaDjj.png' alt='Order Confirmation' style='width: 100px; height: auto; display: block; margin: 20px auto;' />");
            mailBody.Append("<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;'>"); // Centrirano tijelo s bijelom pozadinom
            mailBody.Append("<h2 style='color: #2c3e50; text-align: left;'>Hi " + myAppUser.Username + ",</h2>");
            mailBody.Append("<p style='font-size: 16px; color: #34495e; text-align: left;'>Thank you for your order. Your order #Code is <strong>" + order.OrderCode + "</strong>.</p>");
            mailBody.Append("<br/>");

            mailBody.Append("<table style='width: 100%; border-collapse: collapse; margin-top: 5px;'>");
            mailBody.Append("<thead>");
            mailBody.Append("<tr style='border-bottom: 1px solid #ddd;'>");
            mailBody.Append("<th style='text-align: left; padding: 8px;'>Product</th>");
            mailBody.Append("<th style='text-align: left; padding: 8px;'>Quantity</th>");
            mailBody.Append("<th style='text-align: left; padding: 8px;'>Price</th>");
            mailBody.Append("</tr>");
            mailBody.Append("</thead>");
            mailBody.Append("<tbody>");
            foreach (var orderDetail in order.OrderDetails)
            {
                mailBody.Append("<tr>");
                mailBody.Append("<td style='padding: 8px;'>" + orderDetail.Product.Title + "</td>");
                mailBody.Append("<td style='padding: 8px;'>" + orderDetail.Quantity + "</td>");
                mailBody.Append("<td style='padding: 8px;'>$" + orderDetail.UnitPrice + "</td>");
                mailBody.Append("</tr>");
            }
            mailBody.Append("</tbody>");
            mailBody.Append("</table>");

            mailBody.Append("<p style='font-size: 16px; color: #34495e; text-align: left; margin-top: 20px;'>");
            mailBody.Append("<strong>Total Price: </strong>$" + order.TotalPrice);
            mailBody.Append("</p>");
            mailBody.Append("<p style='font-size: 12px; color: #34495e; text-align: left;'>You can track your order status on our <a href='http://808music.com/' style='color: #d92bf9;'>website</a>.</p>");

            mailBody.Append("<br><p style='font-size: 12px; color: #34495e; text-align: left;'>Thank you, <br/>808 Music</p>");
            mailBody.Append("</div>");
            mailBody.Append("</div>");
            mailBody.Append("</body></html>");




            await _mailService.Send(new MailData()
            {
                Subject = $"Order Confirmation - {order.OrderCode} ",
                IsBodyHtml = true,
                To = myAppUser.Email,
                Body = mailBody
            });
        }

        return new OrderAddResponse
        {
            OrderId = order.Id,
            OrderCode = order.OrderCode,
            TotalPrice = order.TotalPrice,
            Message = "Your order is complete.",
            UserId = request.UserId,
            OrderDetails = order.OrderDetails.Select(od => new OrderDetailResponse
            {
                ProductId = od.ProductId,
                Quantity = od.Quantity,
                UnitPrice = od.UnitPrice,
                Discount = od.Discount
            }).ToList()
        };
    }

    public class OrderAddRequest
    {
        public required int UserId { get; set; }
    }

    public class OrderAddResponse
    {
        public required int OrderId { get; set; }
        public required string OrderCode { get; set; }
        public required decimal TotalPrice { get; set; }
        public required string Message { get; set; }
        public required int UserId { get; set; }
        public List<OrderDetailResponse> OrderDetails { get; set; } = new();
    }

    public class OrderDetailResponse
    {
        public required int ProductId { get; set; }
        public required int Quantity { get; set; }
        public required decimal UnitPrice { get; set; }
        public required decimal Discount { get; set; }
    }
}
