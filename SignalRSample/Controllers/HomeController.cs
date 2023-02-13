﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalRSample.Data;
using SignalRSample.Hubs;
using SignalRSample.Models;
using SignalRSample.Models.ViewModels;
using System.Diagnostics;
using System.Security.Claims;

namespace SignalRSample.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IHubContext<DeathlyHallowsHub> _deathlyHub;
        private readonly IHubContext<OrderHub> _orderHub;
        private readonly ApplicationDbContext _context;

        public HomeController(ILogger<HomeController> logger,
            IHubContext<DeathlyHallowsHub> deathlyHub,
            IHubContext<OrderHub> orderHub,
            ApplicationDbContext context)
        {
            _logger = logger;
            _deathlyHub = deathlyHub;
            _orderHub = orderHub;
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        [Authorize]
        public IActionResult Chat()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            ChatVM chatVM = new()
            {
                Rooms = _context.ChatRooms.ToList(),
                MaxRoomAllowed = 4,
                UserId = userId
            };

            return View(chatVM);
        }

        public IActionResult AdvancedChat()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            ChatVM chatVM = new()
            {
                Rooms = _context.ChatRooms.ToList(),
                MaxRoomAllowed = 4,
                UserId = userId
            };

            return View(chatVM);
        }

        public IActionResult BasicChat()
        {
            return View();
        }

        public async Task<IActionResult> DeathlyHallows(string type)
        {
            if (SD.DeathlyHallowRace.ContainsKey(type))
                SD.DeathlyHallowRace[type]++;

            await _deathlyHub.Clients.All.SendAsync("updateDeathlyHallowCount",
                SD.DeathlyHallowRace[SD.Cloak],
                SD.DeathlyHallowRace[SD.Stone],
                SD.DeathlyHallowRace[SD.Wand]);

            return Accepted();
        }

        public IActionResult Notification()
        {
            return View();
        }

        public IActionResult DeathlyHallowsRace()
        {
            return View();
        }

        public IActionResult HarryPotterHouse()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public IActionResult Order()
        {
            string[] name = { "Bhrugen", "Ben", "Jess", "Laura", "Ron" };
            string[] itemName = { "Food1", "Food2", "Food3", "Food4", "Food5" };

            Random rand = new();
            // Generate a random index less than the size of the array.  
            int index = rand.Next(name.Length);

            Order order = new()
            {
                Name = name[index],
                ItemName = itemName[index],
                Count = index
            };

            return View(order);
        }

        [ActionName("Order")]
        [HttpPost]
        public async Task<IActionResult> OrderPost(Order order)
        {
            _context.Orders.Add(order);
            _context.SaveChanges();
            await _orderHub.Clients.All.SendAsync("newOrder");
            return RedirectToAction(nameof(Order));
        }

        public IActionResult OrderList()
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetAllOrder()
        {
            var productList = _context.Orders.ToList();
            return Json(new { data = productList });
        }
    }
}