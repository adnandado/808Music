using FluentValidation;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using static ProductAddEndpoint;

public class ProductAddValidation : AbstractValidator<ProductAddRequest>
{
    public ProductAddValidation(ApplicationDbContext db)
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .Length(3, 100).WithMessage("Title must be between 3 and 100 characters.");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price must be greater than zero.");

        RuleFor(x => x.Quantity)
            .GreaterThanOrEqualTo(0).WithMessage("Quantity must be zero or greater.");

        RuleFor(x => x.ArtistId).NotEmpty().GreaterThan(0).Must(x => db.Artists.Find(x) != null).WithMessage("Invalid Artist");

        RuleFor(x => x.Quantity)
            .GreaterThanOrEqualTo(0).WithMessage("Quantity must be zero or greater.");

        RuleFor(x => x.isDigital)
            .NotNull().WithMessage("isDigital field is required.");

        RuleFor(x => x.ArtistId)
            .GreaterThan(0).WithMessage("ArtistId must be greater than zero.");

        RuleFor(x => x.ProductType)
            .IsInEnum().WithMessage("Invalid ProductType.");

        RuleFor(x => x.ClothesType)
            .IsInEnum().WithMessage("Invalid ClothesType.")
            .When(x => x.ProductType == ProductType.Clothes)
            .WithMessage("ClothesType is required when ProductType is Clothes.");

        RuleFor(x => x.Photos)
            .NotEmpty().WithMessage("At least one photo is required.")
            .Must(photos => photos.All(photo => photo.Length > 0)).WithMessage("Each photo must be valid.");

        RuleFor(x => x.Bio)
            .MaximumLength(1000).WithMessage("Bio must be less than 1000 characters.");
    }
}
