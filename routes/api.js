const express = require("express");
const router = express.Router();

const LIMIT = 4;

const {
  Op,
  User,
  Movie,
  Theater,
  TheaterStatus,
  TicketType,
  TicketStatus,
  ShowTime,
  Ticket,
  TicketShoppingCart,
  Order,
  OrderStatus,
  OrdererTicket,
  Food,
  FoodStatus,
  FoodOrder,
  FoodShoppingCart
} = require("../models");

router.get("/count/movies", (req, res) => {
  Movie.findAndCountAll()
    .then(data =>
      res.json({ status: true, message: "OK", data: data.count, limit: LIMIT })
    )
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/movies", (req, res) => {
  if (!req.query.page) {
    Movie.findAll()
      .then(data => res.json({ status: true, message: "OK", data: data }))
      .catch(err => res.json({ status: false, message: err }));
    return;
  }

  let page = parseInt(req.query.page);
  if (!page) {
    return;
  }

  let offset = LIMIT * (page - 1);
  Movie.findAll({
    limit: LIMIT,
    offset: offset
  })
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/movies/:id", (req, res) => {
  Movie.findByPk(req.params.id)
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/movies/:id/theaters/:id2", (req, res) => {
  ShowTime.findAll({
    where: {
      movieId: req.params.id,
      theaterId: req.params.id2
    }
  })
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/movies/:id/theaters/:id2/ticket_types/:id3", (req, res) => {
  if (!req.query.date) {
    ShowTime.findAll({
      where: {
        movieId: req.params.id,
        theaterId: req.params.id2,
        ticketTypeId: req.params.id3
      }
    })
      .then(data => res.json({ status: true, message: "OK", data: data }))
      .catch(err => res.json({ status: false, message: err }));
    return;
  }
  ShowTime.findAll({
    where: {
      movieId: req.params.id,
      theaterId: req.params.id2,
      ticketTypeId: req.params.id3,
      date: req.query.date
    }
  })
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/now/:date", (req, res) => {
  if (!req.params.date) {
    Movie.findAll({
      where: {
        startDate: {
          [Op.lte]: req.params.date
        },
        endDate: {
          [Op.gte]: req.params.date
        }
      }
    })
      .then(data => res.json({ status: true, message: "OK", data: data }))
      .catch(err => res.json({ status: false, message: err }));
    return;
  }

  let page = parseInt(req.query.page);
  if (!page) {
    return;
  }

  let offset = LIMIT * (page - 1);
  Movie.findAll({
    where: {
      startDate: {
        [Op.lte]: req.params.date
      },
      endDate: {
        [Op.gte]: req.params.date
      }
    },
    limit: LIMIT,
    offset: offset
  })
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/future/:date", (req, res) => {
  if (!req.params.date) {
    Movie.findAll({
      where: {
        startDate: {
          [Op.gte]: req.params.date
        }
      }
    })
      .then(data => res.json({ status: true, message: "OK", data: data }))
      .catch(err => res.json({ status: false, message: err }));
    return;
  }

  let page = parseInt(req.query.page);
  if (!page) {
    return;
  }

  let offset = LIMIT * (page - 1);
  Movie.findAll({
    where: {
      startDate: {
        [Op.gte]: req.params.date
      }
    },
    limit: LIMIT,
    offset: offset
  })
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.post("/movies", (req, res) => {
  Movie.create({
    name: req.body.name,
    rating: req.body.rating,
    actor: req.body.actor,
    director: req.body.director,
    photoUrl: req.body.photoUrl,
    introduce: req.body.introduce,
    genre: req.body.genre,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  })
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.put("/movies/:id", (req, res) => {
  Movie.update(
    {
      name: req.body.name,
      rating: req.body.rating,
      actor: req.body.actor,
      director: req.body.director,
      photoUrl: req.body.photoUrl,
      introduce: req.body.introduce,
      genre: req.body.genre,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/movies", (req, res) => {
  Movie.destroy({
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/movies/:id", (req, res) => {
  Movie.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/count/theaters", (req, res) => {
  Theater.findAndCountAll()
    .then(data => res.json({ status: true, message: "OK", data: data.count }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/theaters", (req, res) => {
  Theater.findAll()
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/theaters/:id", (req, res) => {
  Theater.findByPk(req.params.id)
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.post("/theaters", (req, res) => {
  Theater.create({
    name: req.body.name,
    address: req.body.address,
    photoUrl: req.body.photoUrl,
    rowNum: req.body.rowNum,
    seatPerRow: req.body.seatPerRow,
    theaterStatusId: req.body.theaterStatusId
  })
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.put("/theaters/:id", (req, res) => {
  Theater.update(
    {
      name: req.body.name,
      address: req.body.address,
      photoUrl: req.body.photoUrl,
      rowNum: req.body.rowNum,
      seatPerRow: req.body.seatPerRow,
      theaterStatusId: req.body.theaterStatusId
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/theaters", (req, res) => {
  Theater.destroy({
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/theaters/:id", (req, res) => {
  Theater.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/theater_statuses", (req, res) => {
  TheaterStatus.findAll()
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.post("/theater_statuses", (req, res) => {
  TheaterStatus.create({
    name: req.body.name
  })
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/count/ticket_types", (req, res) => {
  TicketType.findAndCountAll()
    .then(data => res.json({ status: true, message: "OK", data: data.count }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/ticket_types", (req, res) => {
  TicketType.findAll()
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/ticket_types/:id", (req, res) => {
  TicketType.findByPk(req.params.id)
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.post("/ticket_types", (req, res) => {
  TicketType.create({
    name: req.body.name,
    price: req.body.price,
    ticketStatusId: req.body.ticketStatusId
  })
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.put("/ticket_types/:id", (req, res) => {
  TicketType.update(
    {
      name: req.body.name,
      price: req.body.price,
      ticketStatusId: req.body.ticketStatusId
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/ticket_types", (req, res) => {
  TicketType.destroy({
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/ticket_types/:id", (req, res) => {
  TicketType.destroy({
    where: {
      id: req.params.id
    },
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/ticket_statuses", (req, res) => {
  TicketStatus.findAll()
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/ticket_statuses/:id", (req, res) => {
  TicketStatus.findByPk(req.params.id)
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.post("/ticket_statuses", (req, res) => {
  TicketStatus.create({
    name: req.body.name
  })
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.put("/ticket_statuses/:id", (req, res) => {
  TicketStatus.update(
    {
      where: {
        id: req.params.id
      }
    },
    {
      name: req.body.name
    }
  )
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/ticket_statuses", (req, res) => {
  TicketStatus.destroy({
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/ticket_statuses/:id", (req, res) => {
  TicketStatus.destroy({
    where: {
      id: req.params.id
    },
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/show_times", (req, res) => {
  ShowTime.findAll()
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/show_times/:id", (req, res) => {
  ShowTime.findByPk(req.params.id)
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.post("/show_times/", (req, res) => {
  ShowTime.create({
    time: req.body.time,
    date: req.body.date,
    movieId: req.body.movieId,
    theaterId: req.body.theaterId,
    ticketTypeId: req.body.ticketTypeId
  })
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.put("/show_times/:id", (req, res) => {
  ShowTime.update(
    {
      time: req.body.time,
      date: req.body.date,
      movieId: req.body.movieId,
      theaterId: req.body.theaterId,
      ticketTypeId: req.body.ticketTypeId
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/show_times", (req, res) => {
  ShowTime.destroy({
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/show_times/:id", (req, res) => {
  ShowTime.destroy({
    where: {
      id: req.params.id
    },
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/tickets", (req, res) => {
  Ticket.findAll()
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/tickets/:id", (req, res) => {
  Ticket.findByPk(req.params.id)
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.post("/tickets", (req, res) => {
  Ticket.create({
    seatRow: req.body.seatRow,
    seatColumn: req.body.seatColumn
  })
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.put("/tickets/:id", (req, res) => {
  Ticket.update(
    {
      seatRow: req.body.seatRow,
      seatColumn: req.body.seatColumn
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/tickets", (req, res) => {
  Ticket.destroy({
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/tickets/:id", (req, res) => {
  Ticket.destroy({
    where: {
      id: req.params.id
    },
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/users", (req, res) => {
  User.findAll()
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/users/:id", (req, res) => {
  User.findByPk(req.params.id)
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.post("/users", (req, res) => {
  User.create({
    username: req.body.username,
    hashedPassword: req.body.hashedPassword,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber
  })
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.put("/users/:id", (req, res) => {
  User.update(
    {
      username: req.body.username,
      hashedPassword: req.body.hashedPassword,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/users", (req, res) => {
  User.destroy({
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/users/:id", (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    },
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/ticket_shopping_carts", (req, res) => {
  TicketShoppingCart.findAll()
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/ticket_shopping_carts/:id", (req, res) => {
  TicketShoppingCart.findByPk(req.params.id)
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.post("/ticket_shopping_carts", (req, res) => {
  TicketShoppingCart.create({
    userId: req.body.userId,
    ticketId: req.body.ticketId
  })
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/ticket_shopping_carts", (req, res) => {
  TicketShoppingCart.destroy({
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/ticket_shopping_carts/:id", (req, res) => {
  TicketShoppingCart.destroy({
    where: {
      id: req.params.id
    },
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/order_statuses", (req, res) => {
  OrderStatus.findAll()
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/order_statuses/:id", (req, res) => {
  OrderStatus.findByPk(req.params.id)
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.post("/order_statuses", (req, res) => {
  OrderStatus.create({
    name: req.body.name
  })
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.put("/order_statuses/:id", (req, res) => {
  OrderStatus.update(
    {
      name: req.body.name
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/order_statuses", (req, res) => {
  OrderStatus.destroy({
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/order_statuses/:id", (req, res) => {
  OrderStatus.destroy({
    where: {
      id: req.params.id
    },
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/orders", (req, res) => {
  Order.findAll()
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/orders/:id", (req, res) => {
  Order.findByPk()
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.post("/orders", (req, res) => {
  Order.create({
    orderStatusId: req.body.orderStatusId,
    userId: req.body.userId
  })
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/orders", (req, res) => {
  Order.destroy({
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/orders/:id", (req, res) => {
  Order.destroy({
    where: {
      id: req.param.id
    },
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/ordered_tickets", (req, res) => {
  OrdererTicket.findAll()
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/ordered_tickets/:id", (req, res) => {
  OrdererTicket.findByPk(req.params.id)
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.post("/ordered_tickets", (req, res) => {
  OrdererTicket.create({
    orderId: req.body.orderId,
    ticketId: req.body.ticketId
  })
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/ordered_tickets", (req, res) => {
  OrdererTicket.destroy({
    truncate: yes
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/ordered_tickets/:id", (req, res) => {
  OrdererTicket.destroy({
    where: {
      id: req.params.id
    },
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/foods", (req, res) => {
  Food.findAll()
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/foods/:id", (req, res) => {
  Food.findByPk(req.params.id)
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.post("/foods", (req, res) => {
  Food.create({
    name: req.body.name,
    price: req.body.price
  })
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.put("/foods/:id", (req, res) => {
  Food.update({
    name: req.body.name,
    price: req.body.price,
    foodStatusId: req.body.foodStatusId
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/foods", (req, res) => {
  Food.destroy({
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/foods/:id", (req, res) => {
  Food.destroy({
    where: {
      id: req.params.id
    },
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/food_statuses", (req, res) => {
  FoodStatus.findAll()
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/food_statuses/:id", (req, res) => {
  FoodStatus.findByPk(req.params.id)
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.post("/food_statuses", (req, res) => {
  FoodStatus.create({
    name: req.body.name
  })
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.put("/food_statuses/:id", (req, res) => {
  FoodStatus.update(
    {
      name: req.body.name
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/food_statuses", (req, res) => {
  FoodStatus.destroy({
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/food_statuses/:id", (req, res) => {
  FoodStatus.destroy({
    where: {
      id: req.params.id
    },
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/food_shopping_carts", (req, res) => {
  FoodShoppingCart.findAll()
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/food_shopping_carts/:id", (req, res) => {
  FoodShoppingCart.findByPk(req.params.id)
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.post("/food_shopping_carts", (req, res) => {
  FoodShoppingCart.create({
    quantity: req.body.quantity,
    foodId: req.body.foodId,
    userId: req.body.userId
  })
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/food_shopping_carts", (req, res) => {
  FoodShoppingCart.destroy({
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/food_shopping_carts/:id", (req, res) => {
  FoodShoppingCart.destroy({
    where: {
      id: req.params.id
    },
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/food_orders", (req, res) => {
  FoodOrder.findAll()
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.get("/food_orders/:id", (req, res) => {
  FoodOrder.findByPk(req.params.id)
    .then(data => res.json({ status: true, message: "OK", data: data }))
    .catch(err => res.json({ status: false, message: err }));
});

router.post("/food_orders", (req, res) => {
  FoodOrder.create({
    quantity: req.body.quantity,
    foodId: req.body.foodId,
    orderId: req.body.orderId
  });
});

router.delete("/food_orders", (req, res) => {
  FoodOrder.destroy({
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

router.delete("/food_orders/:id", (req, res) => {
  FoodOrder.destroy({
    where: {
      id: req.params.id
    },
    truncate: true
  })
    .then(() => res.json({ status: true, message: "OK" }))
    .catch(err => res.json({ status: false, message: err }));
});

module.exports = router;
