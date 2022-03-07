namespace Api.DataServices
{
    public class DateTimeHelper
    {


        private static readonly DateTime Epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        public static long GetCurrentTimestamp()
        {
            return ConvertToTimestamp(DateTime.Now);
        }

        public static long ConvertToTimestamp(DateTime value)
        {
            TimeSpan elapsedTime = value - Epoch;
            return (long)elapsedTime.TotalSeconds;
        }
    }
}
