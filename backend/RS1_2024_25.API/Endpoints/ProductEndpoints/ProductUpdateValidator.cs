using FluentValidation;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using System.Linq;
using static ProductUpdateEndpoint;

namespace RS1_2024_25.API.Endpoints.ProductEndpoints
{
    public class ProductUpdateValidator : AbstractValidator<ProductUpdateRequest>
    {
        public ProductUpdateValidator(ApplicationDbContext db)
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MaximumLength(50).WithMessage("Title cannot be longer than 50 characters.");

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Price must be greater than zero.");

            RuleFor(x => x.Price)
               .GreaterThan(0).WithMessage("Price must be greater than zero.");


            RuleFor(x => x.Quantity)
                .GreaterThanOrEqualTo(0).WithMessage("Quantity cannot be negative.");

            RuleFor(x => x.SaleAmount)
                .InclusiveBetween(0m, 1m).WithMessage("Sale amount must be between 0 and 1.");

            RuleFor(x => x.Slug)
                .NotEmpty().WithMessage("Slug is required.");

            RuleFor(x => x.Photos)
                .Must(photos => photos == null || photos.Count == 0 || photos.All(photo => photo.Length > 0))
                .WithMessage("All photos must have valid content.");
        }
    }
}
