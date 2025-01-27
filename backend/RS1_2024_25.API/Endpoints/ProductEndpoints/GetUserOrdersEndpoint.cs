using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace RS1_2024_25.API.Endpoints.OrderEndpoints
{
    public class OrderGetByUserEndpoint : MyEndpointBaseAsync
        .WithRequest<OrderGetByUserEndpoint.GetOrderRequest>
        .WithResult<OrderGetByUserEndpoint.GetOrderResponse>
    {
        private readonly ApplicationDbContext _db;

        public OrderGetByUserEndpoint(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public override async Task<GetOrderResponse> HandleAsync(
            [FromQuery] GetOrderRequest request,
            CancellationToken cancellationToken = default)
        {
            var orders = await _db.UserOrders
                .Where(uo => uo.MyAppUserId == request.UserId)
                .OrderByDescending(uo => uo.Order.DateAdded)
                .Select(uo => new OrderItem
                {
                    OrderId = uo.Order.Id,
                    OrderCode = uo.Order.OrderCode,
                    Status = uo.Order.Status,
                    TotalPrice = uo.Order.TotalPrice,
                    DateAdded = uo.Order.DateAdded,
                    OrderDetails = uo.Order.OrderDetails
                        .Select(od => new OrderDetail
                        {
                            ProductId = od.ProductId,
                            ProductName = od.Product.Title,
                            Quantity = od.Quantity,
                            UnitPrice = od.UnitPrice,
                            Discount = od.Discount,
                            TotalPrice = od.TotalPrice,
                            PhotoPath = od.Product.Photos.Any()
    ? od.Product.Photos.FirstOrDefault().Path
    : null

                        })
                        .ToList()
                })
                .ToListAsync(cancellationToken);

            var user = await _db.MyAppUsers
                .Where(u => u.ID == request.UserId)
                .Select(u => new { u.Username })
                .FirstOrDefaultAsync(cancellationToken);

            if (user == null)
            {
                return new GetOrderResponse
                {
                    Success = false,
                    Message = "User not found.",
                    Orders = new List<OrderItem>()
                };
            }

            return new GetOrderResponse
            {
                Success = true,
                UserName = user.Username,
                Orders = orders
            };
        }

        public class GetOrderRequest
        {
            public required int UserId { get; set; }
        }

        public class GetOrderResponse
        {
            public required bool Success { get; set; }
            public string? Message { get; set; }
            public string UserName { get; set; }
            public List<OrderItem> Orders { get; set; } = new();
        }

        public class OrderItem
        {
            public required int OrderId { get; set; }
            public required string OrderCode { get; set; }
            public required string Status { get; set; }
            public required decimal TotalPrice { get; set; }
            public required DateTime DateAdded { get; set; }
            public List<OrderDetail> OrderDetails { get; set; } = new();
        }

        public class OrderDetail
        {
            public required int ProductId { get; set; }
            public required string ProductName { get; set; }
            public required int Quantity { get; set; }
            public required decimal UnitPrice { get; set; }
            public required decimal Discount { get; set; }
            public required decimal TotalPrice { get; set; }
            public string? PhotoPath { get; set; }
        }
    }
}
