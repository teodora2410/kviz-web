using Kviz.Domain;
using Microsoft.EntityFrameworkCore;

namespace Kviz.DataAccess
{
    public class QuizDatabaseContext(DbContextOptions<QuizDatabaseContext> options) : DbContext(options)
    {
        // Database Tables
        public DbSet<User> Users { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Result> Results { get; set; }
        public DbSet<ResultAnswer> ResultAnswers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Users table constraints
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
                entity.HasIndex(e => e.Username).IsUnique();
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Password).IsRequired();
                entity.Property(e => e.ProfileImage).IsRequired();
            });

            // Quizzes table constraints
            modelBuilder.Entity<Quiz>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.Categories).HasMaxLength(250);
                entity.Property(e => e.TimeLimit).IsRequired();
                entity.Property(e => e.Level).HasMaxLength(50);
                entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            });

            // Questions table constraints
            modelBuilder.Entity<Question>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Type).IsRequired();
            });

            // Answers table constraints
            modelBuilder.Entity<Answer>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Text).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Correct).IsRequired();
            });

            // Results table constraints
            modelBuilder.Entity<Result>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.QuizId).IsRequired();
            });

            // Results answers table constraints
            modelBuilder.Entity<ResultAnswer>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ResultId).IsRequired();
            });
        }
    }
}
