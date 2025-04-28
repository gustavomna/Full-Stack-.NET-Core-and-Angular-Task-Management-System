using Domain.TaskItems;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.TaskItems;

internal sealed class TaskConfiguration : IEntityTypeConfiguration<TaskItem>
{
    public void Configure(EntityTypeBuilder<TaskItem> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title)
            .HasMaxLength(200);

        builder.Property(x => x.Description)
            .HasMaxLength(2000);

        builder.Property(x => x.DueDate)
            .HasColumnType("datetime2")
            .HasColumnName("due_date");

        builder.Property(x => x.Priority)
            .HasConversion<int>()
            .HasColumnType("int") 
            .HasColumnName("priority");

        builder.Property(x => x.Status)
            .HasConversion<int>()
            .HasColumnType("int")
            .HasColumnName("status");

        builder.Property(t => t.UserId)
            .IsRequired();

        builder.HasOne(t => t.User)
            .WithMany(u => u.Tasks)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}