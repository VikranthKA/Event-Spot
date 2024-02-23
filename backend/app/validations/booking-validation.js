const { validationResult } = require('express-validator');

const ticketValidationSchema = {
    ticketName: {
        notEmpty: {
            errorMessage: "Ticket name cannot be empty"
        },
        isLength: {
            options: { min: 2, max: 50 },
            errorMessage: "Ticket name must be between 2 and 50 characters"
        }
    },
    ticketPrice: {
        isNumeric: {
            errorMessage: "Ticket price must be a number"
        },
        notEmpty: {
            errorMessage: "Ticket price cannot be empty"
        }
    },
    ticketCount: {
        isNumeric: {
            errorMessage: "Ticket count must be a number"
        },
        notEmpty: {
            errorMessage: "Ticket count cannot be empty"
        }
    },
    remainingTickets: {
        isNumeric: {
            errorMessage: "Remaining tickets must be a number"
        },
        notEmpty: {
            errorMessage: "Remaining tickets cannot be empty"
        }
    },
    _id: {
        notEmpty: {
            errorMessage: "Ticket ID cannot be empty"
        }
    },
    Quantity: {
        isNumeric: {
            errorMessage: "Quantity must be a number"
        },
        notEmpty: {
            errorMessage: "Quantity cannot be empty"
        }
    }
}



function validateTicket(ticket) {
    const errors = validationResult(ticket);

    if (!errors.isEmpty()) {
        throw new Error(errors.array().map(error => error.msg).join(", "));
    }
}

function validateTicketArray(ticketArray) {
    ticketArray.forEach(ticket => {
        validateTicket(ticket);
    });
}

module.exports = { ticketValidationSchema, validateTicket, validateTicketArray }
