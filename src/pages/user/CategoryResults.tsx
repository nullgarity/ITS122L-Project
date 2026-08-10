import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Gavel as GavelIcon,
  AccountBalance as AccountBalanceIcon,
  FamilyRestroom as FamilyIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Assignment as AssignmentIcon,
  MonetizationOn as MonetizationOnIcon,
  MoreHoriz as MoreHorizIcon,
} from "@mui/icons-material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../auth/AuthContext";
import { logout } from "../../services/authService";

interface CategoryData {
  name: string;
  description: string;
  icon: React.ReactElement;
  color: string;
  count?: number;
}

const CategoryResults: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Define categories with their metadata
  const categoryDefinitions: CategoryData[] = [
    {
      name: "Criminal Law",
      description:
        "Cases involving criminal charges, violations, and prosecutions",
      icon: <GavelIcon sx={{ fontSize: 40 }} />,
      color: "#e57373",
    },
    {
      name: "Civil Law",
      description:
        "Disputes between individuals, contracts, and property matters",
      icon: <AccountBalanceIcon sx={{ fontSize: 40 }} />,
      color: "#64b5f6",
    },
    {
      name: "Family Law",
      description: "Marriage, divorce, custody, and domestic relations",
      icon: <FamilyIcon sx={{ fontSize: 40 }} />,
      color: "#81c784",
    },
    {
      name: "Corporate Law",
      description: "Business formation, mergers, and corporate governance",
      icon: <BusinessIcon sx={{ fontSize: 40 }} />,
      color: "#ffb74d",
    },
    {
      name: "Constitutional Law",
      description:
        "Constitutional rights, government powers, and civil liberties",
      icon: <AccountBalanceIcon sx={{ fontSize: 40 }} />,
      color: "#ba68c8",
    },
    {
      name: "Labor Law",
      description: "Employment disputes, workplace rights, and labor relations",
      icon: <WorkIcon sx={{ fontSize: 40 }} />,
      color: "#4db6ac",
    },
    {
      name: "Tax Law",
      description: "Tax disputes, compliance, and revenue matters",
      icon: <MonetizationOnIcon sx={{ fontSize: 40 }} />,
      color: "#f06292",
    },
    {
      name: "Other",
      description: "Miscellaneous legal matters and specialized cases",
      icon: <MoreHorizIcon sx={{ fontSize: 40 }} />,
      color: "#90a4ae",
    },
  ];

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      setLoading(true);
      try {
        const categoriesWithCounts = await Promise.all(
          categoryDefinitions.map(async (category) => {
            const q = query(
              collection(db, "cases"),
              where("category", "==", category.name)
            );
            const snapshot = await getDocs(q);
            return {
              ...category,
              count: snapshot.size,
            };
          })
        );
        setCategories(categoriesWithCounts);
      } catch (error) {
        console.error("Error fetching category counts:", error);
        setCategories(categoryDefinitions);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryCounts();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/user/search?category=${encodeURIComponent(categoryName)}`);
  };

  if (loading) {
    return (
      <Box>
        <AppBar position="static" sx={{ bgcolor: "#d32f2f" }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Browse Categories
            </Typography>
            <Button color="inherit" onClick={() => navigate("/user/dashboard")}>
              Dashboard
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Box display="flex" justifyContent="center" alignItems="center" p={4}>
          <CircularProgress />
          <Typography ml={2}>Loading categories...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "#d32f2f" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Browse Categories
          </Typography>
          <Button color="inherit" onClick={() => navigate("/user/dashboard")}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => navigate("/user/search")}>
            Search
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Browse by Category
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={4}>
          Explore cases organized by legal category. Click on any category to
          view related cases.
        </Typography>

        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={category.name}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                  bgcolor: "#fafafa",
                  border: `2px solid ${category.color}20`,
                }}
                onClick={() => handleCategoryClick(category.name)}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: "center", p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mb: 2,
                      color: category.color,
                    }}
                  >
                    {category.icon}
                  </Box>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {category.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 2 }}
                  >
                    {category.description}
                  </Typography>
                  {category.count !== undefined && (
                    <Chip
                      label={`${category.count} case${
                        category.count !== 1 ? "s" : ""
                      }`}
                      size="small"
                      sx={{
                        bgcolor: `${category.color}20`,
                        color: category.color,
                        fontWeight: "bold",
                      }}
                    />
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      bgcolor: category.color,
                      "&:hover": {
                        bgcolor: category.color,
                        filter: "brightness(0.9)",
                      },
                    }}
                  >
                    View Cases
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Additional Actions */}
        <Box sx={{ mt: 4 }}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Can't find what you're looking for?
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
              Try using our advanced search or create a new case if you need to
              submit one.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/user/search")}
              >
                Advanced Search
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/user/create-case")}
              >
                Create New Case
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default CategoryResults;
