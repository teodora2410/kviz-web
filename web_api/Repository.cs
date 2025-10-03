using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Kviz.DataAccess
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly QuizDatabaseContextFactory _contextFactory = new();

        public async Task<T?> GetByIdAsync(object id)
        {
            await using var context = _contextFactory.CreateDbContext(null!);
            return await context.Set<T>().FindAsync(id);
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            await using var context = _contextFactory.CreateDbContext(null!);
            return await context.Set<T>().ToListAsync();
        }

        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            await using var context = _contextFactory.CreateDbContext(null!);
            return await context.Set<T>().Where(predicate).ToListAsync();
        }

        public async Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate)
        {
            await using var context = _contextFactory.CreateDbContext(null!);
            return await context.Set<T>().FirstOrDefaultAsync(predicate);
        }

        public async Task<T> AddAsync(T entity)
        {
            await using var context = _contextFactory.CreateDbContext(null!);
            await context.Set<T>().AddAsync(entity);
            await context.SaveChangesAsync();
            return entity;
        }

        public async Task UpdateAsync(T entity)
        {
            await using var context = _contextFactory.CreateDbContext(null!);
            context.Set<T>().Update(entity);
            await context.SaveChangesAsync();
        }

        public async Task DeleteAsync(T entity)
        {
            await using var context = _contextFactory.CreateDbContext(null!);
            context.Set<T>().Remove(entity);
            await context.SaveChangesAsync();
        }

        public async Task DeleteByIdAsync(int id)
        {
            await using var context = _contextFactory.CreateDbContext(null!);
            var entity = await context.Set<T>().FindAsync(id);
            if (entity != null)
            {
                context.Set<T>().Remove(entity);
                await context.SaveChangesAsync();
            }
        }
    }
}
