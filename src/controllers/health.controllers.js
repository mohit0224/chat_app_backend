import { apiResponse } from "../utils/httpresponse.utils.js";
import mongoose from "mongoose";
import disk from "diskusage";
import axios from "axios";
import path from "path";
import fs from "fs";

export const healthCheck = async (req, res) => {
    const dbState = mongoose.connection.readyState;
    let dbStatus = "disconnected";
    let apiStatus = "unknown";
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    const uptime = process.uptime();
    let diskUsage = {};

    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
        );
    };

    const formatCpuTime = (microseconds) => {
        return (microseconds / 1000).toFixed(2) + " ms";
    };

    const formatUptime = (uptimeInSeconds) => {
        const hours = Math.floor(uptimeInSeconds / 3600);
        const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
        const seconds = Math.floor(uptimeInSeconds % 60);
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    switch (dbState) {
        case 0:
            dbStatus = "disconnected";
            break;
        case 1:
            dbStatus = "connected";
            break;
        case 2:
            dbStatus = "connecting";
            break;
        case 3:
            dbStatus = "disconnecting";
            break;
    }

    try {
        const response = await axios.get(
            "https://dummyjson.com/c/5bae-4b61-4982-bc5f"
        );
        if (response.status === 200) {
            apiStatus = "Ok";
        } else {
            apiStatus = "error";
        }
    } catch (error) {
        apiStatus = "error";
    }

    try {
        const { available, free, total } = await disk.check("/");
        const diskUsagePercentage = ((total - free) / total) * 100;
        diskUsage = {
            available: formatBytes(available),
            free: formatBytes(free),
            total: formatBytes(total),
            diskUsagePercentage: `${Math.floor(diskUsagePercentage)}%`,
        };
    } catch (err) {
        diskUsage = "error";
    }

    const checkFileSystem = () => {
        const testFilePath = path.join("./public", "test.txt");
        try {
            fs.writeFileSync(testFilePath, "Health check");
            fs.unlinkSync(testFilePath);
            return "accessible";
        } catch (error) {
            return "not Accessible";
        }
    };

    const healthStatus = {
        uptime: formatUptime(uptime),
        status: "Ok",
        dbStatus: dbStatus,
        apiStatus: apiStatus,
        fileSystem: checkFileSystem(),
        memoryUsage: {
            rss: formatBytes(memoryUsage.rss),
            heapTotal: formatBytes(memoryUsage.heapTotal),
            heapUsed: formatBytes(memoryUsage.heapUsed),
            external: formatBytes(memoryUsage.external),
        },
        cpuUsage: {
            user: formatCpuTime(cpuUsage.user),
            system: formatCpuTime(cpuUsage.system),
        },
        diskUsage,
    };

    if (dbStatus !== "connected" || apiStatus !== "Ok") {
        healthStatus.status = "error";
        return res
            .status(500)
            .json(
                new apiResponse(500, "Health status check-up !!", healthStatus)
            );
    }

    return res
        .status(200)
        .json(new apiResponse(200, "Health status check-up !!", healthStatus));
};
