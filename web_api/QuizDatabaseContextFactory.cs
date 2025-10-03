using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Kviz.DataAccess
{
    public class QuizDatabaseContextFactory : IDesignTimeDbContextFactory<QuizDatabaseContext>
    {
        public QuizDatabaseContext CreateDbContext(string[] args) => new(GetOptions());

        private static DbContextOptions<QuizDatabaseContext> GetOptions()
        {
            var config = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true).Build();

            return new DbContextOptionsBuilder<QuizDatabaseContext>().UseMySql(config.GetConnectionString("Db"), ServerVersion.AutoDetect(config.GetConnectionString("Db"))).Options;
        }
    }
}
