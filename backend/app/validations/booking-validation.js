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

module.exports = ticketValidationSchema
