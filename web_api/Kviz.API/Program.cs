namespace Kviz.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var services = builder.Services;
            var configuration = builder.Configuration;
            services.AddControllers();
            services.AddJwtAuthentication(configuration);
            services.AddAppCors();
            services.AddDatabase(configuration);
            services.AddAppServices();
            services.AddAuthorization();

            var app = builder.Build();
            app.UseCors("CorsAll");
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}
