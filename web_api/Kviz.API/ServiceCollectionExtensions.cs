using Kviz.DataAccess;
using Kviz.DataAccess.Models;
using Kviz.Service.IMappingHelper;
using Kviz.Service.IServices;
using Kviz.Service.Services;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace Kviz.API
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<QuizDatabaseContext>(options =>
                options.UseMySql(configuration.GetConnectionString("Db"), ServerVersion.AutoDetect(configuration.GetConnectionString("Db"))));
            return services;
        }

        public static IServiceCollection AddAppServices(this IServiceCollection services)
        {
            services.AddAutoMapper(typeof(MappingHelper));
            services.AddScoped<IRepository<User>, Repository<User>>();
            services.AddScoped<IRepository<Quiz>, Repository<Quiz>>();
            services.AddScoped<IRepository<Question>, Repository<Question>>();
            services.AddScoped<IRepository<Answer>, Repository<Answer>>();
            services.AddScoped<IRepository<Result>, Repository<Result>>();
            services.AddScoped<IRepository<ResultAnswer>, Repository<ResultAnswer>>();
            services.AddScoped<IAuthentificationService, AuthentificationService>();
            services.AddScoped<IIntegrityService, IntegrityService>();
            services.AddScoped<IQuizService, QuizService>();
            services.AddScoped<IResultService, ResultService>();
            return services;
        }

        public static IServiceCollection AddAppCors(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("CorsAll", policy =>
                    policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            });
            return services;
        }

        public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            var securityConfig = configuration.GetSection("SystemIntegrityToken");

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = securityConfig["issuer"],
                    ValidAudience = securityConfig["audience"],
                    IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityConfig["key"] ?? "0"))
                };
            });

            return services;
        }
    }
}
