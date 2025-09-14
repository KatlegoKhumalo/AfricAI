import logging
from livekit.agents import function_tool, RunContext
import requests
from langchain_community.tools import DuckDuckGoSearchRun
from typing import Optional

@function_tool()
async def search_web(
    context: RunContext,
    query: str) -> str:
    """
    Search the web for current information and resources.
    """
    try:
        results = DuckDuckGoSearchRun().run(tool_input=query)
        logging.info(f"Search results for '{query}': {results}")
        return results
    except Exception as e:
        logging.error(f"Error searching the web for '{query}': {e}")
        return f"An error occurred while searching the web for '{query}'."

@function_tool()
async def get_african_education_resources(
    context: RunContext,
    topic: str) -> str:
    """
    Get educational resources and opportunities specifically relevant to African learners.
    """
    try:
        # Search for African-specific educational resources
        search_queries = [
            f"African education resources {topic}",
            f"free online courses Africa {topic}",
            f"African tech communities {topic}",
            f"scholarships Africa {topic}",
            f"African universities {topic} programs"
        ]
        
        results = []
        for query in search_queries:
            try:
                search_result = DuckDuckGoSearchRun().run(tool_input=query)
                results.append(f"Resources for '{query}': {search_result}")
            except Exception as e:
                logging.error(f"Error searching for '{query}': {e}")
        
        combined_results = "\n\n".join(results)
        logging.info(f"African education resources for '{topic}': {combined_results}")
        return combined_results
    except Exception as e:
        logging.error(f"Error getting African education resources for '{topic}': {e}")
        return f"An error occurred while searching for African education resources for '{topic}'."

@function_tool()
async def explain_concept(
    context: RunContext,
    concept: str,
    level: str = "beginner") -> str:
    """
    Explain a concept in simple terms with African context and examples.
    
    Args:
        concept: The concept to explain
        level: The explanation level (beginner, intermediate, advanced)
    """
    try:
        # Create a detailed explanation prompt
        explanation_prompt = f"""
        Explain the concept of '{concept}' at a {level} level. 
        
        Please include:
        1. A simple, clear definition
        2. Real-world examples relevant to African contexts
        3. Why this concept is important for African development
        4. Practical applications in African industries
        5. How someone can start learning about this concept
        6. Relevant African success stories or case studies if available
        
        Keep the explanation engaging and culturally relevant.
        """
        
        # Use web search to get current information about the concept
        search_result = DuckDuckGoSearchRun().run(tool_input=f"{concept} Africa examples applications")
        
        explanation = f"""
        **{concept.upper()} - {level.upper()} LEVEL EXPLANATION**
        
        {explanation_prompt}
        
        **Current Information and African Context:**
        {search_result}
        
        **Next Steps:**
        - Practice with hands-on examples
        - Join African tech communities focused on this topic
        - Look for local mentors or study groups
        - Consider how this concept can solve local challenges
        """
        
        logging.info(f"Explained concept '{concept}' at {level} level")
        return explanation
    except Exception as e:
        logging.error(f"Error explaining concept '{concept}': {e}")
        return f"An error occurred while explaining the concept '{concept}'."
