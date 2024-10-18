import { ScenarioType } from "@/contexts";

/**
 * Contains the scenario details, including instructions, descriptions, role, and customer information.
 * These details are used to guide the user through each scenario during the demo.
 */
export const scenarioTextContent: Record<
  ScenarioType,
  {
    scenarioTitle: string;
    instructions: string;
    fullDescription: string;
    briefDescription: string;
    roleTitle: string;
    customerName: string;
    customerDescription: string;
  }
> = {
  product_demo: {
    scenarioTitle: "Product Demo",
    instructions: "Demonstrate the product to a potential customer.",
    fullDescription:
      "In this scenario, you are a Sales Representative working for a major Telecommunications company. The customer, Jordan, is an existing subscriber interested in learning more about a new product offering. Your goal is to effectively demonstrate the product's key features, address any questions Jordan may have, and encourage them to proceed to the next stage of the sales process.",
    briefDescription:
      "In this scenario, you are a Sales Representative working for a major Telecommunications company. The customer, Jordan, is an existing subscriber interested in learning more...",
    roleTitle: "Sales Representative",
    customerName: "Jordan",
    customerDescription:
      "An existing subscriber interested in learning more about a new product offering.",
  },
  negotiation: {
    scenarioTitle: "Negotiation",
    instructions: "Negotiate pricing and terms with the customer.",
    fullDescription:
      "In this scenario, you are a Sales Agent who must negotiate the pricing and terms of a deal with Taylor, a customer interested in purchasing a product but concerned about the pricing. You need to balance securing the sale with maintaining the company's profitability by finding a mutually beneficial agreement.",
    briefDescription:
      "In this scenario, you are a Sales Agent who must negotiate the pricing and terms of a deal with Taylor, a customer interested in purchasing a product but concerned about...",
    roleTitle: "Sales Agent",
    customerName: "Taylor",
    customerDescription:
      "A customer interested in the product but seeking a better deal on the price.",
  },
  objection_handling: {
    scenarioTitle: "Objection Handling",
    instructions: "Handle customer objections effectively.",
    fullDescription:
      "In this scenario, you are a Customer Support Specialist facing Alex, a customer who has objections about the product's suitability for their needs. You must listen carefully, acknowledge Alex's concerns, and provide solutions or alternatives to overcome their objections, helping to move the sale forward.",
    briefDescription:
      "In this scenario, you are a Customer Support Specialist facing Alex, a customer who has objections about the product's suitability for their needs. You must listen carefully...",
    roleTitle: "Customer Support Specialist",
    customerName: "Alex",
    customerDescription:
      "A customer with concerns or objections about your product or service.",
  },
  closing_deal: {
    scenarioTitle: "Closing Deal",
    instructions: "Close the deal with the customer.",
    fullDescription:
      "In this scenario, you are a Sales Closer at the final stage of the sales process with Jamie. Jamie is ready to commit but may need reassurance or a final push. Your task is to address any last-minute concerns and secure Jamie's commitment to the purchase.",
    briefDescription:
      "In this scenario, you are a Sales Closer at the final stage of the sales process with Jamie. Jamie is ready to commit but may need reassurance or a final push...",
    roleTitle: "Sales Closer",
    customerName: "Jamie",
    customerDescription:
      "A customer ready to finalize the deal but may have final concerns.",
  },
  follow_up: {
    scenarioTitle: "Follow Up",
    instructions: "Follow up with the customer after the initial engagement.",
    fullDescription:
      "In this scenario, you are a Customer Success Representative following up with Sam after a previous interaction. Your goal is to check in on Sam's experience with the product, gather feedback, and offer additional assistance or upsell opportunities to strengthen the relationship and encourage future engagement.",
    briefDescription:
      "In this scenario, you are a Customer Success Representative following up with Sam after a previous interaction. Your goal is to check in on Sam's experience with...",
    roleTitle: "Customer Success Representative",
    customerName: "Sam",
    customerDescription:
      "A customer you've previously engaged with, now needing a follow-up.",
  },
  customer_support: {
    scenarioTitle: "Customer Support",
    instructions: "Provide post-sale support to the customer.",
    fullDescription:
      "In this scenario, you are a Customer Support Specialist assisting Morgan, who is experiencing issues with a recently purchased service. You must troubleshoot the issue, offer solutions, and ensure Morgan is satisfied with the resolution.",
    briefDescription:
      "In this scenario, you are a Customer Support Specialist assisting Morgan, who is experiencing issues with a recently purchased service. You must troubleshoot...",
    roleTitle: "Customer Support Specialist",
    customerName: "Morgan",
    customerDescription:
      "A customer needing help resolving a problem after the sale.",
  },
};