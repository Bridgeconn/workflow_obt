# workflow_obt

Workflow UI for Oral bible translation (OBT) checking

## Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (v18 or later)

## Getting Started

Follow these steps to set up the project locally:

1. **Clone the Repository**

   Open your terminal and run:

   ```bash
   https://github.com/Bridgeconn/workflow_obt.git
   cd workflow_obt
   ```

2. **Install Dependencies**

   Use npm to install the project dependencies:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root location of the project and add the following;

   ```
   NEXT_PUBLIC_BASE_URL=<your_base_url>
   ApiToken=<your_api_token>
   ```

4. **Run the Development Server**

   Start the Next.js development server with:

   ```bash
   npm run dev
   ```

5. **Access the Application**

   Open your web browser and go to [http://localhost:3000](http://localhost:3000) to see your application running.

## Scripts

- **Development**: `npm run dev` or `yarn dev` - Start the development server.
- **Build**: `npm run build` or `yarn build` - Build the application for production.
- **Start**: `npm start` or `yarn start` - Start the production server after building.