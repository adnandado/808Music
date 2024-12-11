﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using RS1_2024_25.API.Data;

#nullable disable

namespace RS1_2024_25.API.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20241211173336_MyUserArtistInvite")]
    partial class MyUserArtistInvite
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.Album", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("AlbumTypeId")
                        .HasColumnType("int");

                    b.Property<int>("ArtistId")
                        .HasColumnType("int");

                    b.Property<string>("CoverPath")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Distributor")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsActive")
                        .HasColumnType("bit");

                    b.Property<int>("NumOfTracks")
                        .HasColumnType("int");

                    b.Property<DateTime>("ReleaseDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("AlbumTypeId");

                    b.HasIndex("ArtistId");

                    b.ToTable("Albums");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.AlbumType", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("AlbumTypes");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.Artist", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Bio")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("DeletionDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("Followers")
                        .HasColumnType("int");

                    b.Property<bool>("IsFlaggedForDeletion")
                        .HasColumnType("bit");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ProfileBackgroundPath")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ProfilePhotoPath")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Artists");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.ArtistTrack", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("ArtistId")
                        .HasColumnType("int");

                    b.Property<bool>("IsLead")
                        .HasColumnType("bit");

                    b.Property<bool>("ShowOnProfile")
                        .HasColumnType("bit");

                    b.Property<int>("TrackId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ArtistId");

                    b.HasIndex("TrackId");

                    b.ToTable("ArtistsTracks");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.Auth.MyAppUser", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ID"));

                    b.Property<int>("CountryId")
                        .HasColumnType("int");

                    b.Property<DateTime>("DateOfBirth")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsActive")
                        .HasColumnType("bit");

                    b.Property<bool>("IsAdmin")
                        .HasColumnType("bit");

                    b.Property<bool>("IsManager")
                        .HasColumnType("bit");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ID");

                    b.HasIndex("CountryId");

                    b.ToTable("MyAppUsers");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.Auth.MyAuthenticationToken", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ID"));

                    b.Property<string>("IpAddress")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("MyAppUserId")
                        .HasColumnType("int");

                    b.Property<DateTime>("RecordedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Value")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ID");

                    b.HasIndex("MyAppUserId");

                    b.ToTable("MyAuthenticationTokens");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.Auth.MyRefreshToken", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("ExpiryTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("MyAppUserId")
                        .HasColumnType("int");

                    b.Property<string>("Token")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("MyAppUserId");

                    b.ToTable("MyRefreshTokens");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.Auth.MyResetToken", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("ExpiryTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("MyAppUserId")
                        .HasColumnType("int");

                    b.Property<string>("ResetToken")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("MyAppUserId");

                    b.ToTable("MyResetTokens");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.City", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ID"));

                    b.Property<int>("CountryId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ID");

                    b.HasIndex("CountryId");

                    b.ToTable("Cities");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.Country", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ID"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ID");

                    b.ToTable("Countries");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.Credits", b =>
                {
                    b.Property<int>("TrackId")
                        .HasColumnType("int");

                    b.Property<string>("CopyrightOwner")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Performers")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Producers")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Writers")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("TrackId");

                    b.ToTable("Credits");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.Genre", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Tag")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Genres");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.MyUserArtistInvite", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("ArtistId")
                        .HasColumnType("int");

                    b.Property<DateTime>("ExpiryDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("MyAppUserId")
                        .HasColumnType("int");

                    b.Property<int>("RoleId")
                        .HasColumnType("int");

                    b.Property<string>("Token")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("ArtistId");

                    b.HasIndex("MyAppUserId");

                    b.HasIndex("RoleId");

                    b.ToTable("MyUserArtistInvites");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.Order", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("MyAppUserId")
                        .HasColumnType("int");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("TotalPrice")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("MyAppUserId");

                    b.ToTable("Orders");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.OrderDetail", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("OrderId")
                        .HasColumnType("int");

                    b.Property<int>("ProductId")
                        .HasColumnType("int");

                    b.Property<int>("QtyOrdered")
                        .HasColumnType("int");

                    b.Property<double>("TotalPrice")
                        .HasColumnType("float");

                    b.Property<double>("UnitPrice")
                        .HasColumnType("float");

                    b.HasKey("Id");

                    b.HasIndex("OrderId");

                    b.HasIndex("ProductId");

                    b.ToTable("OrderDetails");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.Product", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<bool>("IsDigital")
                        .HasColumnType("bit");

                    b.Property<float>("Price")
                        .HasColumnType("real");

                    b.Property<int>("QtyInStock")
                        .HasColumnType("int");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Products");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.ProductPhoto", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Path")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("ProductId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ProductId");

                    b.ToTable("ProductPhotos");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.Track", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("AlbumId")
                        .HasColumnType("int");

                    b.Property<int>("Length")
                        .HasColumnType("int");

                    b.Property<int>("Streams")
                        .HasColumnType("int");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("TrackPath")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("isExplicit")
                        .HasColumnType("bit");

                    b.HasKey("Id");

                    b.HasIndex("AlbumId");

                    b.ToTable("Tracks");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.TrackGenre", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("GenreId")
                        .HasColumnType("int");

                    b.Property<int>("TrackId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("GenreId");

                    b.HasIndex("TrackId");

                    b.ToTable("TrackGenres");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.UserArtist", b =>
                {
                    b.Property<int>("MyAppUserId")
                        .HasColumnType("int");

                    b.Property<int>("ArtistId")
                        .HasColumnType("int");

                    b.Property<bool>("IsUserOwner")
                        .HasColumnType("bit");

                    b.Property<int>("RoleId")
                        .HasColumnType("int");

                    b.HasKey("MyAppUserId", "ArtistId");

                    b.HasIndex("ArtistId");

                    b.HasIndex("RoleId");

                    b.ToTable("UserArtists");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.UserArtistRole", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("RoleName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("UserArtistRoles");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.Album", b =>
                {
                    b.HasOne("RS1_2024_25.API.Data.Models.AlbumType", "AlbumType")
                        .WithMany()
                        .HasForeignKey("AlbumTypeId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("RS1_2024_25.API.Data.Models.Artist", "Artist")
                        .WithMany()
                        .HasForeignKey("ArtistId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("AlbumType");

                    b.Navigation("Artist");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.ArtistTrack", b =>
                {
                    b.HasOne("RS1_2024_25.API.Data.Models.Artist", "Artist")
                        .WithMany()
                        .HasForeignKey("ArtistId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("RS1_2024_25.API.Data.Models.Track", "Track")
                        .WithMany()
                        .HasForeignKey("TrackId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Artist");

                    b.Navigation("Track");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.Auth.MyAppUser", b =>
                {
                    b.HasOne("RS1_2024_25.API.Data.Models.Country", "Country")
                        .WithMany()
                        .HasForeignKey("CountryId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Country");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.Auth.MyAuthenticationToken", b =>
                {
                    b.HasOne("RS1_2024_25.API.Data.Models.Auth.MyAppUser", "MyAppUser")
                        .WithMany()
                        .HasForeignKey("MyAppUserId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("MyAppUser");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.Auth.MyRefreshToken", b =>
                {
                    b.HasOne("RS1_2024_25.API.Data.Models.Auth.MyAppUser", "MyAppUser")
                        .WithMany()
                        .HasForeignKey("MyAppUserId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("MyAppUser");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.Auth.MyResetToken", b =>
                {
                    b.HasOne("RS1_2024_25.API.Data.Models.Auth.MyAppUser", "MyAppUser")
                        .WithMany()
                        .HasForeignKey("MyAppUserId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("MyAppUser");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.City", b =>
                {
                    b.HasOne("RS1_2024_25.API.Data.Models.Country", "Country")
                        .WithMany()
                        .HasForeignKey("CountryId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Country");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.Credits", b =>
                {
                    b.HasOne("RS1_2024_25.API.Data.Models.Track", "Track")
                        .WithMany()
                        .HasForeignKey("TrackId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Track");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.MyUserArtistInvite", b =>
                {
                    b.HasOne("RS1_2024_25.API.Data.Models.Artist", "Artist")
                        .WithMany()
                        .HasForeignKey("ArtistId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("RS1_2024_25.API.Data.Models.Auth.MyAppUser", "MyAppUser")
                        .WithMany()
                        .HasForeignKey("MyAppUserId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("RS1_2024_25.API.Data.Models.UserArtistRole", "UserArtistRole")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Artist");

                    b.Navigation("MyAppUser");

                    b.Navigation("UserArtistRole");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.Order", b =>
                {
                    b.HasOne("RS1_2024_25.API.Data.Models.Auth.MyAppUser", "MyAppUser")
                        .WithMany()
                        .HasForeignKey("MyAppUserId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("MyAppUser");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.OrderDetail", b =>
                {
                    b.HasOne("RS1_2024_25.API.Data.Models.Order", "Order")
                        .WithMany()
                        .HasForeignKey("OrderId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("RS1_2024_25.API.Data.Models.Product", "Product")
                        .WithMany()
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Order");

                    b.Navigation("Product");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.ProductPhoto", b =>
                {
                    b.HasOne("RS1_2024_25.API.Data.Models.Product", "Product")
                        .WithMany()
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Product");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.Track", b =>
                {
                    b.HasOne("RS1_2024_25.API.Data.Models.Album", "Album")
                        .WithMany()
                        .HasForeignKey("AlbumId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Album");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.TrackGenre", b =>
                {
                    b.HasOne("RS1_2024_25.API.Data.Models.Genre", "Genre")
                        .WithMany()
                        .HasForeignKey("GenreId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("RS1_2024_25.API.Data.Models.Track", "Track")
                        .WithMany()
                        .HasForeignKey("TrackId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Genre");

                    b.Navigation("Track");
                });

            modelBuilder.Entity("RS1_2024_25.API.Data.Models.UserArtist", b =>
                {
                    b.HasOne("RS1_2024_25.API.Data.Models.Artist", "Artist")
                        .WithMany()
                        .HasForeignKey("ArtistId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("RS1_2024_25.API.Data.Models.Auth.MyAppUser", "User")
                        .WithMany()
                        .HasForeignKey("MyAppUserId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("RS1_2024_25.API.Data.Models.UserArtistRole", "Role")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Artist");

                    b.Navigation("Role");

                    b.Navigation("User");
                });
#pragma warning restore 612, 618
        }
    }
}
