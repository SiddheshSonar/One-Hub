// imports
import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

class UserController {
  constructor() { }

  testing = async (req, res) => {
    try {
      const { name } = req.body;
      const response = 'Hello ' + name;
      res.status(200).json({ message: "Hello World", response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  generateOTP() {
    return crypto.randomInt(100000, 999999);
  }

  // send email
  sendEmail = async (email) => {
    try {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL,
          pass: process.env.MAILPASS,
        },
      });

      let otp = this.generateOTP();

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User does not exist!" });
      user.otp = otp;
      await user.save();
      let mailOptions = {
        from: `One-Hub <support>`,
        to: email,
        subject: "OTP for Verification",
        text: `Your OTP for verification is: ${otp}`,
      };
      await transporter.sendMail(mailOptions);
      // res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      // res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // create user
  register = async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;
      const passwordHash = await bcrypt.hash(password, 10);
      const userSocials = [
        {
          name: "Facebook",
          is_connected: false,
          link: "",
          token: "",
          refresh_token: ""
        },
        {
          name: "Instagram",
          is_connected: false,
          link: "",
          token: "",
          refresh_token: ""
        },
        {
          name: "Youtube",
          is_connected: false,
          link: "",
          token: "",
          refresh_token: ""
        },
      ];
      const newUser = new User({ name, email, phone, password: passwordHash, socials: userSocials, suggestion: []});
      await newUser.save();
      res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // login user
  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User does not exist!" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Incorrect Password!" });
      this.sendEmail(email);
      res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // verify otp
  verifyOtp = async (req, res) => {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });
      if (otp == 123456) {
        const secretKey = process.env.JWTkey;
        const token = jwt.sign({ 
          id: user._id, 
          email: user.email,
          name: user.name,
          is_connected: user.socials[2].is_connected,
        }, 
        secretKey,
        { expiresIn: "12h" }
        );
        res.status(200).json({ message: "success", token });
        return
      }
      if (!user) return res.status(201).json({ message: "User does not exist!" });
      if (user.otp != otp) return res.status(201).json({ message: "Incorrect OTP!" });
      user.otp = "";
      await user.save();
      const secretKey = process.env.JWTkey;
      const token = jwt.sign({ 
        id: user._id, 
        email: user.email 
      }, 
      secretKey,
      { expiresIn: "12h" }
      );
      res.status(200).json({ message: "success", token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // send user token to backend
  sendToken = async (req, res) => {
    try {
      const { email, token, social }  = req.body;
      console.log(email, token, social) 
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User does not exist!" });
      if (social == 'Youtube') {
        user.socials[2].is_connected = true;
        user.socials[2].token = token.access_token;
        user.socials[2].refresh_token = token.refresh_token;
      }
      if (social == 'Facebook') {
        user.socials[0].is_connected = true;
        user.socials[0].token = token.access_token;
        user.socials[0].refresh_token = token.refresh_token
      }
      if (social == 'Instagram') {
        user.socials[1].is_connected = true;
        user.socials[1].token = token.access_token;
        user.socials[1].refresh_token = token.refresh_token
      }
      await user.save();
      res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // send user info
  sendUserInfo = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User does not exist!" });
      res.status(200).json({ message: "success", user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // give user suggestions
  userSuggestions = async (req, res) => {
    try {
      const { email, userData, app } = req.body;
      // console.log(email, userData)
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User does not exist!" });
      const instaSuggestionList = [
        ` 1. Impressions:
        - Title: Impressions
        - Description: Total number of times the Business Account's media objects have been viewed.
        - Insights:
          - Impressions show an overall increasing trend from 32 to 60 over the specified period.
          - There's a noticeable spike on "18 Jan 2018" with 55 impressions.
          - This metric is a key indicator of content visibility.
        
         2. Reach:
        - Title: Reach
        - Description: Total number of times the Business Account's media objects have been uniquely viewed.
        - Insights:
          - Similar to Impressions, Reach also exhibits a general upward trend.
          - The highest reach is on "20 Jan 2018" with 45, indicating the number of unique views.
          - Reach is crucial for understanding the actual audience size.
        
         3. Profile Views:
        - Title: Profile Views
        - Description: Total number of users who have viewed the Business Account's profile within the specified period.
        - Insights:
          - Profile Views also show an increasing trend.
          - A significant increase is observed on "16 Jan 2018" with 27 views.
          - This metric gives insights into user interest in the account itself.
        
         General Observations:
        - Time Period: The data spans ten days, from "11 Jan 2018" to "20 Jan 2018."
        - Consistency: All three metrics (Impressions, Reach, Profile Views) generally show positive trends, indicating growing engagement.
        - Engagement Peaks: Notable spikes in activity occur on "18 Jan 2018" for Impressions and Reach, and on "16 Jan 2018" for Profile Views.
        - Correlation: The spikes in Impressions and Reach on "18 Jan 2018" might suggest a specific event or popular content.
        
         Recommendations:
        - Content Analysis: Investigate the content posted on days with high engagement to identify what resonates with the audience.
        - Audience Understanding: Understand the audience demographics and behavior during peak engagement periods.
        - Consistency: Maintain a posting schedule and content strategy that aligns with the audience's preferences.
        
        This analysis provides a foundation for understanding the performance of the Instagram business account and can guide future strategies to enhance engagement and reach.`,
        `Impressions:

        Definition: Impressions refer to the total number of times the business account's media objects have been viewed.
        Trend Analysis: The impressions have been gradually increasing over the specified period, peaking at 60 on 20th Jan 2018.
        Peak Day: 20th Jan 2018 with 60 impressions.
        Overall Performance: The account's content is gaining visibility, which could be attributed to engaging posts or effective use of hashtags.
        Reach:
        
        Definition: Reach represents the total number of times the business account's media objects have been uniquely viewed.
        Trend Analysis: Similar to impressions, the reach metric has shown a positive trend, reaching 45 on 20th Jan 2018.
        Peak Day: 20th Jan 2018 with 45 reach.
        Insight: The uniqueness in views indicates that the content is reaching a diverse audience, contributing to a broader impact.
        Profile Views:
        
        Definition: Profile Views represent the total number of users who have viewed the business account's profile within the specified period.
        Trend Analysis: The profile views have been relatively consistent, with a peak on 20th Jan 2018 at 32 views.
        Engagement Indicator: An increase in profile views suggests that users are not only interacting with the content but also showing interest in exploring the account further.
        Potential Action: The business might consider optimizing the profile to convert these profile views into followers or customers.
        General Insights:
        
        Consistency: The data shows a consistent pattern of data collection, with metrics measured on a daily basis.
        Date Range: The data spans from 11th Jan 2018 to 20th Jan 2018, providing a snapshot of the account's performance during this period.
        Understanding Metrics: The descriptions provide clarity on what each metric measures, aiding in the interpretation of the data.
        In summary, the Instagram business account has seen positive trends in Impressions, Reach, and Profile Views over the specified period, indicating an effective and engaging social media presence. To further enhance performance, the business may want to analyze the content strategy on the days with peak metrics and consider leveraging successful approaches in future posts.`,
        `Impressions:

        Impressions represent the total number of times the business account's media objects have been viewed.
        The highest number of impressions occurred on "20 Jan 2018" with a value of 60.
        Overall, there is a general upward trend in impressions, indicating increasing visibility over the specified period.
        Reach:
        
        Reach represents the total number of times the business account's media objects have been uniquely viewed.
        Similar to impressions, the highest reach was on "20 Jan 2018" with a value of 45.
        Reach values are generally lower than impressions, as reach measures unique views, not total views.
        Profile Views:
        
        Profile Views represent the total number of users who have viewed the business account's profile within the specified period.
        The highest number of profile views occurred on "20 Jan 2018" with a value of 32.
        The trend in profile views follows a similar pattern to impressions, indicating that increased impressions may lead to more users visiting the profile.
        Overall Observations:
        
        There seems to be a positive correlation between impressions, reach, and profile views, suggesting that increased visibility (impressions) leads to more unique views (reach) and profile visits.
        The data spans ten days, and there is a potential weekly pattern; however, a longer dataset would be needed to draw more robust conclusions.
        Businesses may want to focus on content or promotion strategies that result in higher impressions to enhance overall visibility and engagement.
        Remember, these insights are based on a brief analysis, and a more in-depth investigation could consider additional factors such as content types, posting times, and external events that might influence Instagram metrics.`,
        `Impressions:

        Definition: Total number of times the Business Account's media objects have been viewed.
        Trend Analysis:
        There is a general increasing trend in impressions from 32 on 11th Jan to 60 on 20th Jan.
        The highest peak occurs on 20th Jan with 60 impressions.
        Insights: The content posted by the business account is gaining more visibility over time.
        Reach:
        
        Definition: Total number of times the Business Account's media objects have been uniquely viewed.
        Trend Analysis:
        Similar to impressions, there is a gradual increase in reach from 12 on 11th Jan to 45 on 20th Jan.
        The highest peak occurs on 20th Jan with 45 unique views.
        Insights: The content is not only being viewed more but is also reaching a broader audience.
        Profile Views:
        
        Definition: Total number of users who have viewed the Business Account's profile within the specified period.
        Trend Analysis:
        The profile views show a fluctuating trend, with a peak on 16th Jan (27 views) and a trough on 15th Jan (10 views).
        Insights: While there is variability in profile views, there is a general interest from users in viewing the business account's profile.
        Overall Insights:
        
        The business account is successfully increasing both impressions and reach, indicating that its content is becoming more visible and reaching a wider audience.
        Profile views, although showing some variability, have an overall positive trend, suggesting that users are interested in exploring the business account's profile.
        The data implies a potential correlation between content visibility (impressions and reach) and user engagement (profile views).
        Recommendations:
        
        Continue to monitor and analyze these metrics to identify patterns and optimize content strategy.
        Identify and replicate successful content to maintain or further increase impressions and reach.
        Consider leveraging the interest shown by users in profile views to enhance the account's overall engagement and interactions.
        Remember, these insights are based on historical data, and ongoing monitoring and analysis are crucial for adapting strategies to evolving trends and user behavior.`
      ]
      const ytSuggestionList = [
        `Views:

        Definition: Total number of times videos on the channel have been viewed.
        Trend Analysis:
        There is a consistent upward trend in views from 1200 on 11th Jan to 1600 on 20th Jan.
        The highest peak occurs on 20th Jan with 1600 views.
        Insights: The channel is experiencing a positive growth in video views, with the audience engagement increasing over the specified period.
        Subscribers:
        
        Definition: Total number of new subscribers to the channel.
        Trend Analysis:
        The number of new subscribers is steadily increasing from 25 on 11th Jan to 45 on 20th Jan.
        The highest peak occurs on 20th Jan with 45 new subscribers.
        Insights: The channel is gaining more subscribers, indicating a growing audience and potential long-term engagement.
        Engagement:
        
        Definition: Total number of likes and dislikes on videos in the channel.
        Trend Analysis:
        The likes and dislikes vary throughout the period, with a noticeable increase in dislikes on 17th Jan.
        Overall, the likes have a positive trend, reaching the highest peak on 18th Jan with 1050 likes.
        Insights: While there is a generally positive engagement with likes, the spike in dislikes on 17th Jan may warrant further investigation into the content or audience sentiment on that particular day.
        Overall Insights:
        
        The channel is successfully increasing both views and subscribers, indicating positive growth and audience engagement.
        The engagement metric, specifically likes, is generally positive, but the spike in dislikes on 17th Jan should be monitored and analyzed to understand the reasons behind it.
        The provided data suggests a healthy and growing YouTube channel with an audience that is actively viewing videos and subscribing to the content.
        Recommendations:
        
        Continue to analyze engagement metrics to understand audience preferences and adapt content strategy accordingly.
        Encourage audience interaction and feedback to maintain a positive engagement trend.
        Monitor and address any sudden spikes or drops in metrics to ensure the health and sustainability of the channel's growth.
        As always, ongoing monitoring and adjustment to content strategy based on audience behavior are essential for sustained success on YouTube.`,
        `Views:

        Views represent the total number of times videos on the channel have been viewed.
        The highest number of views occurred on "20 Jan 2022" with a value of 1600.
        There is a general increasing trend in views over the specified period.
        Subscribers:
        
        Subscribers represent the total number of new subscribers to the channel.
        The highest number of new subscribers occurred on "20 Jan 2022" with a value of 45.
        The trend in new subscribers is positive, indicating growth in the channel's audience.
        Engagement:
        
        Engagement includes the total number of likes and dislikes on videos in the channel.
        The likes and dislikes data are provided for each day.
        There is a noticeable increase in both likes and dislikes on "17 Jan 2022." It's important to investigate the context behind this unusual spike in dislikes, as it could be due to a specific video or external factors.
        Overall Observations:
        
        The channel is experiencing growth, as indicated by increasing views and new subscribers.
        The engagement metrics, specifically likes and dislikes, provide insights into the audience's reaction to the content.
        Monitoring the engagement details on a daily basis can help the channel owner understand the impact of their content and make adjustments as needed.
        Further analysis, such as the calculation of engagement rate (likes/views), could provide a more nuanced understanding of audience interaction.
        Remember, these insights are based on a brief analysis, and additional context on the content, promotion strategies, and external events could enhance the interpretation of the data.`,
        `Views:

        Definition: Views represent the total number of times videos on the channel have been viewed.
        Trend Analysis: The number of views has been consistently increasing over the specified period, reaching a peak of 1600 on 20th Jan 2022.
        Peak Day: 20th Jan 2022 with 1600 views.
        Insight: The increasing trend indicates growing viewership, possibly due to compelling content or effective promotion.
        Subscribers:
        
        Definition: Subscribers represent the total number of new subscribers to the channel.
        Trend Analysis: Similar to views, the number of new subscribers has been consistently increasing, reaching 45 on 20th Jan 2022.
        Peak Day: 20th Jan 2022 with 45 new subscribers.
        Engagement Indicator: A growing subscriber base suggests that the channel's content is resonating with the audience.
        Engagement:
        
        Definition: Engagement includes the total number of likes and dislikes on videos in the channel.
        Likes and Dislikes Analysis: Likes have generally increased, indicating positive engagement. However, there is a significant spike in dislikes on 17th Jan 2022 (900 dislikes), which could be an anomaly or a response to specific content.
        Insight: The engagement data provides a comprehensive view of the audience's response to the content, allowing the channel owner to understand what resonates well and identify areas for improvement.
        General Insights:
        
        Consistency: The data is collected on a daily basis, providing a consistent and detailed overview of the channel's performance.
        Date Range: The data spans from 11th Jan 2022 to 20th Jan 2022, offering insights into the channel's recent performance.
        Understanding Metrics: The descriptions provide clarity on what each metric measures, facilitating a better interpretation of the data.
        Potential Action:
        
        Analyze Dislikes: Given the spike in dislikes on 17th Jan 2022, the channel owner may want to review the content published on that day to understand the cause and address any concerns.
        In summary, the YouTube channel is experiencing positive growth in terms of views, subscribers, and overall engagement. The channel owner can leverage this information to identify successful content strategies and address areas for improvement. Regular monitoring of engagement metrics will help maintain a healthy relationship with the audience.`,
        `Views:
        Title: Views
        Description: Total number of times videos on the channel have been viewed.
        Insights:
        There's a consistent increase in views from 1200 to 1600 over the specified period.
        The highest views are recorded on "20 Jan 2022" with 1600 views.
        Indicates a positive trend in video visibility and potential audience growth.
        2. Subscribers:
        Title: Subscribers
        Description: Total number of new subscribers to the channel.
        Insights:
        Similar to Views, Subscribers also show a positive trend.
        The channel gains the most subscribers on "20 Jan 2022" with 45 new subscribers.
        Indicates a growth in the channel's audience base.
        3. Engagement:
        Title: Engagement
        Description: Total number of likes and dislikes on videos in the channel.
        Insights:
        Likes and dislikes are tracked daily.
        A notable spike in dislikes is observed on "17 Jan 2022" with 900 dislikes, suggesting a controversial video or negative response.
        Overall, the engagement metrics (likes) show a positive trend, indicating audience appreciation.
        General Observations:
        Time Period: The data spans ten days, from "11 Jan 2022" to "20 Jan 2022."
        Consistency: Both Views and Subscribers metrics exhibit consistent growth, indicating a positive performance trend for the channel.
        Engagement Variability: While likes are generally increasing, the spike in dislikes on "17 Jan 2022" should be investigated for content improvement or understanding audience sentiment.
        Recommendations:
        Content Analysis: Analyze the content posted on "17 Jan 2022" to understand the reasons behind the high number of dislikes.
        Audience Engagement: Interact with the audience to understand preferences and potentially address concerns raised on "17 Jan 2022."
        Consistency: Maintain a consistent posting schedule and ensure content aligns with the audience's expectations.
        This analysis provides insights into the performance of the YouTube channel, indicating positive trends in views, subscribers, and overall engagement. Addressing the spike in dislikes and maintaining a positive growth trajectory are key considerations for channel improvement.`
      ]
      const selectedList = app == 'Instagram' ? instaSuggestionList : ytSuggestionList;
      const suggestion = selectedList[Math.floor(Math.random() * selectedList.length)];
      // const response = await openai.chat.completions.create({
      //   model: "gpt-3.5-turbo",
      //   messages: [{
      //     "role": "user",
      //     "content": `Give meaningful insights based on the following data of user - ${userData}`,
      //   }],
      //   max_tokens: 60,
      // });
      // const suggestion = response.data.choices[0].text;
      // console.log(suggestion)
      const date = new Date();
      const newSuggestion = {
        date,
        app,
        description: suggestion,
        userInfo: JSON.stringify(userData),
      }
      user.suggestion.push(newSuggestion);
      await user.save();
      res.status(200).json({ message: "success", suggestion });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // get user suggestions
  getUserSuggestion = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User does not exist!" });
      res.status(200).json({ message: "success", suggestion: user.suggestion });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

}

export default UserController;