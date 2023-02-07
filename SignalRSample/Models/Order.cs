namespace SignalRSample.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string ItemName { get; set; } = null!;
        public int Count { get; set; }
    }
}
