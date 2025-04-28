using Microsoft.Extensions.Caching.Distributed;


namespace Infrastructure.Caching
{
    public static class CacheOptions
    {
        private static readonly DistributedCacheEntryOptions _defaultExpiration = new()
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(1)
        };

        public static DistributedCacheEntryOptions DefaultExpiration => _defaultExpiration;

        public static DistributedCacheEntryOptions Create(TimeSpan? expiration = null) =>
            expiration is not null ?
                new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = expiration } :
                DefaultExpiration;
    }
}
